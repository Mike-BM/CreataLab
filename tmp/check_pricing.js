import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data, error } = await supabase.from('site_settings').select('value').eq('key', 'pricing').single();
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log(JSON.stringify(data.value, null, 2));
}

check();
