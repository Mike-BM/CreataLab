import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function auditAdmins() {
    const { data: users, error } = await supabase.from('admin_users').select('*');
    if (error) {
        console.error('Error:', error.message);
        return;
    }

    console.log('--- Admin Audit ---');
    users.forEach(u => {
        console.log(`Email: [${u.email}] (Length: ${u.email.length})`);
        console.log(`ID: ${u.id}`);
        console.log(`Hash: ${u.password_hash}`);
        console.log('-------------------');
    });
}

auditAdmins();
