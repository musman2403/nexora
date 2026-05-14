import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// read .env
const envPath = path.resolve('.env');
const envFile = fs.readFileSync(envPath, 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim().replace(/^['"](.*)['"]$/, '$1');
  }
});

const supabaseUrl = env['VITE_SUPABASE_URL'];
const supabaseKey = env['VITE_SUPABASE_ANON_KEY'];

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('site_config').select('*');
  console.log('--- DATABASE CHECK ---');
  console.log('Error:', error);
  console.log('Data:', data);
}

check();
