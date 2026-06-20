import { MongoClient } from 'mongodb';

// Shared MongoDB Connection
const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (!uri) {
  throw new Error('Please add your MONGODB_URI to .env');
}

// Caching connection across function invocations
if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export default async function handler(req, res) {
  // Add CORS headers for flexibility
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { table, select, countOnly, filterCol, filterVal, neqCol, neqVal, orderCol, ascending, limit, single, upsert } = req.query;

  if (!table) {
    return res.status(400).json({ error: 'Missing table parameter' });
  }

  try {
    const mongoClient = await clientPromise;
    const db = mongoClient.db('nexora');
    const collection = db.collection(table);

    // 1. GET (Read)
    if (req.method === 'GET') {
      let query = {};
      if (filterCol && filterVal !== undefined) {
        if (filterCol === 'id') {
          const numVal = Number(filterVal);
          query.id = isNaN(numVal) ? filterVal : numVal;
        } else {
          query[filterCol] = filterVal;
        }
      }

      // neq (not-equal) filter support
      if (neqCol && neqVal !== undefined) {
        if (neqCol === 'id') {
          const numVal = Number(neqVal);
          query[neqCol] = { $ne: isNaN(numVal) ? neqVal : numVal };
        } else {
          query[neqCol] = { $ne: neqVal };
        }
      }

      if (countOnly === 'true') {
        const count = await collection.countDocuments(query);
        return res.status(200).json({ data: [], count });
      }

      let cursor = collection.find(query);

      // Sorting
      if (orderCol) {
        const sortOrder = ascending === 'true' ? 1 : -1;
        cursor = cursor.sort({ [orderCol]: sortOrder });
      }

      // Limit
      if (limit) {
        cursor = cursor.limit(parseInt(limit, 10));
      }

      const data = await cursor.toArray();

      if (single === 'true') {
        return res.status(200).json({ data: data[0] || null });
      }

      return res.status(200).json({ data });
    }

    // 2. POST (Insert / Upsert)
    if (req.method === 'POST') {
      const body = req.body;

      if (upsert === 'true') {
        const updates = Array.isArray(body) ? body : [body];
        const results = [];
        for (const item of updates) {
          const filter = { id: item.id };
          const update = { $set: item };
          const result = await collection.updateOne(filter, update, { upsert: true });
          results.push(result);
        }
        return res.status(200).json({ data: body });
      }

      const documents = Array.isArray(body) ? body : [body];

      for (const doc of documents) {
        if (doc.id === undefined || doc.id === null) {
          const lastDoc = await collection.findOne({}, { sort: { id: -1 } });
          const nextId = lastDoc && typeof lastDoc.id === 'number' ? lastDoc.id + 1 : 1;
          doc.id = nextId;
        }
        if (!doc.created_at) {
          doc.created_at = new Date().toISOString();
        }
      }

      const result = await collection.insertMany(documents);
      return res.status(200).json({ data: documents });
    }

    // 3. PUT (Update)
    if (req.method === 'PUT') {
      const body = req.body;
      let filter = {};

      if (filterCol && filterVal !== undefined) {
        if (filterCol === 'id') {
          const numVal = Number(filterVal);
          filter.id = isNaN(numVal) ? filterVal : numVal;
        } else {
          filter[filterCol] = filterVal;
        }
      } else if (body.id !== undefined) {
        filter.id = Number(body.id);
      } else {
        return res.status(400).json({ error: 'Missing filter for update' });
      }

      const updateData = { ...body };
      delete updateData._id;

      await collection.updateOne(filter, { $set: updateData });
      return res.status(200).json({ data: body });
    }

    // 4. DELETE
    if (req.method === 'DELETE') {
      let filter = {};
      if (filterCol && filterVal !== undefined) {
        if (filterCol === 'id') {
          const numVal = Number(filterVal);
          filter.id = isNaN(numVal) ? filterVal : numVal;
        } else {
          filter[filterCol] = filterVal;
        }
      } else {
        return res.status(400).json({ error: 'Missing filter for delete' });
      }

      await collection.deleteOne(filter);
      return res.status(200).json({ data: { success: true } });
    }

    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (error) {
    console.error('Database handler error:', error);
    return res.status(500).json({ error: error.message });
  }
}
