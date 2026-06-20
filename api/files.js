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
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const { path } = req.query;

  if (!path) {
    return res.status(400).json({ error: 'Missing path parameter' });
  }

  try {
    const mongoClient = await clientPromise;
    const db = mongoClient.db('nexora');
    const collection = db.collection('storage');

    const fileDoc = await collection.findOne({ path });

    if (!fileDoc || !fileDoc.base64) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Extract mime-type and binary data
    const match = fileDoc.base64.match(/^data:([^;]+);base64,(.*)$/);
    if (!match) {
      return res.status(500).json({ error: 'Invalid file data format' });
    }

    const contentType = match[1];
    const base64Data = match[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // Return the binary content with Cache-Control headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    return res.status(200).send(buffer);
  } catch (error) {
    console.error('Files handler error:', error);
    return res.status(500).json({ error: error.message });
  }
}
