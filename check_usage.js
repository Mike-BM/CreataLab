import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function checkCounts() {
    const tables = ['contact_messages', 'bookings', 'contact_inquiries', 'booking_requests'];
    
    console.log('--- Table Usage check ---');
    for (const table of tables) {
        const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
        if (error) {
            console.log(`Table [${table}]: ERROR (${error.message})`);
        } else {
            console.log(`Table [${table}]: ${count} rows`);
        }
    }
}

checkCounts();
