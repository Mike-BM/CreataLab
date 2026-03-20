import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function checkTables() {
    const tables = ['admin_users', 'contact_messages', 'bookings', 'posts', 'projects', 'site_settings', 'contact_inquiries', 'booking_requests'];
    
    for (const table of tables) {
        const { error } = await supabase.from(table).select('count', { count: 'exact', head: true });
        if (error) {
            console.log(`Table [${table}]: NOT FOUND or ERROR (${error.message})`);
        } else {
            console.log(`Table [${table}]: EXISTS`);
        }
    }
}

checkTables();
