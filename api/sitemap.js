import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let clientPromise;

if (!uri) throw new Error('Please add MONGODB_URI to .env');

if (!global._mongoClientPromise) {
  const client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

const BASE_URL = 'https://nexora.com.pk';

// Static pages with their SEO priority and change frequency
const STATIC_ROUTES = [
  { path: '/',         changefreq: 'weekly',  priority: '1.0' },
  { path: '/about',   changefreq: 'monthly', priority: '0.8' },
  { path: '/services',changefreq: 'monthly', priority: '0.8' },
  { path: '/projects',changefreq: 'weekly',  priority: '0.9' },
  { path: '/blog',    changefreq: 'daily',   priority: '0.9' },
  { path: '/contact', changefreq: 'monthly', priority: '0.7' },
];

function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toW3CDate(date) {
  if (!date) return new Date().toISOString().split('T')[0];
  try {
    return new Date(date).toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const mongoClient = await clientPromise;
    const db = mongoClient.db('nexora');

    // Fetch all blogs (id + created_at + updated_at for lastmod)
    const blogs = await db
      .collection('blogs')
      .find({}, { projection: { id: 1, created_at: 1, updated_at: 1, _id: 0 } })
      .toArray();

    // Fetch all partners (for partner detail pages)
    const partners = await db
      .collection('partners')
      .find({}, { projection: { name: 1, created_at: 1, _id: 0 } })
      .toArray();

    // Build XML
    const today = new Date().toISOString().split('T')[0];

    const staticUrlsXml = STATIC_ROUTES.map(route => `
  <url>
    <loc>${BASE_URL}${escapeXml(route.path)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('');

    const blogUrlsXml = blogs.map(blog => `
  <url>
    <loc>${BASE_URL}/blog/${escapeXml(String(blog.id))}</loc>
    <lastmod>${toW3CDate(blog.updated_at || blog.created_at)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('');

    const partnerUrlsXml = partners
      .filter(p => p.name)
      .map(p => `
  <url>
    <loc>${BASE_URL}/partner/${encodeURIComponent(escapeXml(p.name))}</loc>
    <lastmod>${toW3CDate(p.created_at)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`).join('');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
    http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${staticUrlsXml}
${blogUrlsXml}
${partnerUrlsXml}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600'); // Cache 1 hour
    return res.status(200).send(sitemap);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return res.status(500).json({ error: error.message });
  }
}
