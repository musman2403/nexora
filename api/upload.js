import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (!uri) {
  throw new Error('Please add your MONGODB_URI to .env');
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const { filePath, base64 } = req.body;

  if (!filePath || !base64) {
    return res.status(400).json({ error: 'Missing filePath or base64 data' });
  }

  try {
    const mongoClient = await clientPromise;
    const db = mongoClient.db('nexora');
    const collection = db.collection('storage');

    // Upsert the image in storage collection
    await collection.updateOne(
      { path: filePath },
      { $set: { path: filePath, base64, uploaded_at: new Date().toISOString() } },
      { upsert: true }
    );

    return res.status(200).json({ path: filePath, success: true });
  } catch (error) {
    console.error('Upload handler error:', error);
    return res.status(500).json({ error: error.message });
  }
}
