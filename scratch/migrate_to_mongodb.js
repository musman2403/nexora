import { createClient } from '@supabase/supabase-js';
import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import dns from 'dns';

if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  console.warn('Could not set custom DNS servers:', e.message);
}



// Parse .env manually
function getEnv() {
  const envPath = path.resolve('.env');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  envContent.split('\n').forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value.length > 0) {
      env[key.trim()] = value.join('=').trim().replace(/^['"](.*)['"]$/, '$1');
    }
  });
  return env;
}

const env = getEnv();
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;
const mongoUri = env.MONGODB_URI;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Supabase credentials not found in .env');
  process.exit(1);
}
if (!mongoUri) {
  console.error('Error: MONGODB_URI not found in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function downloadAndStoreImage(url, db) {
  try {
    // Check if it is a Supabase storage URL
    if (!url || !url.includes('/storage/v1/object/public/')) {
      return url; // Return as-is if it's not a Supabase URL
    }

    // Extract the relative path of the file
    // Example: https://.../storage/v1/object/public/projects/blogs/image.png
    // The relative path is blogs/image.png
    const projectsIndex = url.indexOf('/public/projects/');
    if (projectsIndex === -1) {
      return url;
    }
    const relativePath = url.substring(projectsIndex + '/public/projects/'.length);

    console.log(`Downloading Supabase image: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || 'image/png';
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = `data:${contentType};base64,${buffer.toString('base64')}`;

    console.log(`Saving image to MongoDB storage: ${relativePath}`);
    const storageCollection = db.collection('storage');
    await storageCollection.updateOne(
      { path: relativePath },
      { $set: { path: relativePath, base64, uploaded_at: new Date().toISOString() } },
      { upsert: true }
    );

    // Return the new URL pointing to our Vercel files endpoint
    return `/api/files/${relativePath}`;
  } catch (err) {
    console.error(`Failed to migrate image ${url}:`, err.message);
    return url; // Keep original URL on error
  }
}

async function migrate() {
  console.log('--- STARTING MIGRATION ---');
  let mongoClient;
  try {
    mongoClient = new MongoClient(mongoUri);
    await mongoClient.connect();
    const db = mongoClient.db('nexora');
    console.log('Connected successfully to MongoDB.');

    // 1. Migrate site_config
    console.log('\nMigrating site_config...');
    const { data: configs, error: configErr } = await supabase.from('site_config').select('*');
    if (configErr) {
      console.error('Error fetching site_config from Supabase:', configErr);
    } else if (configs) {
      console.log(`Found ${configs.length} site configs. Inserting into MongoDB...`);
      const collection = db.collection('site_config');
      for (const config of configs) {
        await collection.updateOne({ id: config.id }, { $set: config }, { upsert: true });
      }
      console.log('site_config migrated successfully.');
    }

    // 2. Migrate sessions
    console.log('\nMigrating sessions...');
    const { data: sessions, error: sessionErr } = await supabase.from('sessions').select('*');
    if (sessionErr) {
      console.error('Error fetching sessions from Supabase:', sessionErr);
    } else if (sessions) {
      console.log(`Found ${sessions.length} sessions. Inserting into MongoDB...`);
      const collection = db.collection('sessions');
      for (const session of sessions) {
        // cast id to number
        session.id = Number(session.id);
        await collection.updateOne({ id: session.id }, { $set: session }, { upsert: true });
      }
      console.log('sessions migrated successfully.');
    }

    // 3. Migrate queries
    console.log('\nMigrating queries...');
    const { data: queries, error: queryErr } = await supabase.from('queries').select('*');
    if (queryErr) {
      console.error('Error fetching queries from Supabase:', queryErr);
    } else if (queries) {
      console.log(`Found ${queries.length} queries. Inserting into MongoDB...`);
      const collection = db.collection('queries');
      for (const query of queries) {
        query.id = Number(query.id);
        await collection.updateOne({ id: query.id }, { $set: query }, { upsert: true });
      }
      console.log('queries migrated successfully.');
    }

    // 4. Migrate partners
    console.log('\nMigrating partners...');
    const { data: partners, error: partnerErr } = await supabase.from('partners').select('*');
    if (partnerErr) {
      console.error('Error fetching partners from Supabase:', partnerErr);
    } else if (partners) {
      console.log(`Found ${partners.length} partners. Processing images & inserting...`);
      const collection = db.collection('partners');
      for (const partner of partners) {
        partner.id = Number(partner.id);
        if (partner.logo_url) {
          partner.logo_url = await downloadAndStoreImage(partner.logo_url, db);
        }
        await collection.updateOne({ id: partner.id }, { $set: partner }, { upsert: true });
      }
      console.log('partners migrated successfully.');
    }

    // 5. Migrate blogs
    console.log('\nMigrating blogs...');
    const { data: blogs, error: blogErr } = await supabase.from('blogs').select('*');
    if (blogErr) {
      console.error('Error fetching blogs from Supabase:', blogErr);
    } else if (blogs) {
      console.log(`Found ${blogs.length} blogs. Processing images & inserting...`);
      const collection = db.collection('blogs');
      for (const blog of blogs) {
        blog.id = Number(blog.id);
        if (blog.image) {
          blog.image = await downloadAndStoreImage(blog.image, db);
        }
        await collection.updateOne({ id: blog.id }, { $set: blog }, { upsert: true });
      }
      console.log('blogs migrated successfully.');
    }

    // 6. Migrate projects
    console.log('\nMigrating projects...');
    const { data: projects, error: projectErr } = await supabase.from('projects').select('*');
    if (projectErr) {
      console.error('Error fetching projects from Supabase:', projectErr);
    } else if (projects) {
      console.log(`Found ${projects.length} projects. Processing images & inserting...`);
      const collection = db.collection('projects');
      for (const project of projects) {
        project.id = Number(project.id);
        if (project.image) {
          project.image = await downloadAndStoreImage(project.image, db);
        }
        await collection.updateOne({ id: project.id }, { $set: project }, { upsert: true });
      }
      console.log('projects migrated successfully.');
    }

    console.log('\n--- MIGRATION COMPLETED SUCCESSFULLY ---');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    if (mongoClient) {
      await mongoClient.close();
    }
  }
}

migrate();
