
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkmsfghqbguykxyrkpry.supabase.co';
const supabaseAnonKey = 'sb_publishable_k6328K8qEJs4hOKki37BaA_OmTP9P5L';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkBlogs() {
  const { data, error } = await supabase.from('blogs').select('*');
  if (error) {
    console.error('Error fetching blogs:', error);
  } else {
    console.log('Current blogs count:', data.length);
    console.log('Blogs:', data);
  }
}

checkBlogs();
