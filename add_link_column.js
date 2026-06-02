import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function addLinkColumn() {
  console.log('Adding "link" column to "posts" table if it doesn\'t exist...');
  
  // Checking existing columns is hard with JS client without RPC, but we can try to select it.
  // Alternatively, we just try to add it.
  
  const { error } = await supabase.rpc('execute_sql', {
    sql_query: 'ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS link TEXT;'
  });

  if (error) {
    console.error('Error adding column:', error);
    // If RPC isn't available, we might have to just try selecting it to see if it's there.
    const { data, error: selectError } = await supabase.from('posts').select('link').limit(1);
    if (selectError && selectError.message.includes('column "link" does not exist')) {
        console.log('Column "link" definitely does not exist and I cannot add it via RPC.');
        console.log('Please add it manually in the Supabase Dashboard: ALTER TABLE public.posts ADD COLUMN link TEXT;');
    } else if (!selectError) {
        console.log('Column "link" already exists or was added successfully.');
    }
  } else {
    console.log('Column "link" added successfully or already exists.');
  }
}

addLinkColumn();
