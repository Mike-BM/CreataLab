import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DEFAULT_PASS = 'ChangeMe123!';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function verifyAll() {
    const { data: users, error } = await supabase.from('admin_users').select('*');
    if (error) { console.error(error); return; }

    for (const user of users) {
        const valid = bcrypt.compareSync(DEFAULT_PASS, user.password_hash);
        console.log(`User: ${user.email} | Default Password Valid: ${valid}`);
    }
}

verifyAll();
