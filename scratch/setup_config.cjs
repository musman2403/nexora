const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function setup() {
  console.log("Setting up site_config table...");
  
  // Since we can't always run arbitrary SQL via RPC unless it's configured, 
  // we'll try to use the REST API to check if it exists, but actually the best way is to 
  // just assume it might not exist and use a migration-like approach if we had one.
  // For this environment, I'll try to use a simple approach.
  
  const sql = `
    CREATE TABLE IF NOT EXISTS public.site_config (
      id TEXT PRIMARY KEY,
      value TEXT,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
    );
    ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Allow ALL on Site Config" ON public.site_config;
    CREATE POLICY "Allow ALL on Site Config" ON public.site_config FOR ALL USING (true) WITH CHECK (true);
    INSERT INTO public.site_config (id, value) VALUES ('hero_headline', 'Nexora Ventures delivers integrated real estate solutions — from strategic acquisition to turnkey construction — for investors who demand precision.') ON CONFLICT (id) DO NOTHING;
  `;

  // We'll try to run this via a hacky way or just tell the user we need the table.
  // Actually, I can just try to insert. If it fails, the table doesn't exist.
  
  const { error } = await supabase.from('site_config').upsert({ 
    id: 'hero_headline', 
    value: 'Nexora Ventures delivers integrated real estate solutions — from strategic acquisition to turnkey construction — for investors who demand precision.' 
  });

  if (error && error.code === '42P01') {
    console.error("Table 'site_config' does not exist. Please run the following SQL in your Supabase SQL Editor:");
    console.log(sql);
  } else if (error) {
    console.error("Error updating site_config:", error);
  } else {
    console.log("site_config table updated successfully (or already existed).");
  }
}

setup();
