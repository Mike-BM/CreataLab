import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkProjectLink() {
  const { data, error } = await supabase.from('projects').select('link').limit(1);
  if (error) {
    console.error('Column "link" does not exist in "projects" table.');
    console.error('Error:', error.message);
  } else {
    console.log('Column "link" exists in "projects" table.');
  }
}

checkProjectLink();
