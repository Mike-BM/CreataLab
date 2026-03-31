import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DEFAULT_PASS = process.env.ADMIN_DEFAULT_PASSWORD;
if (!DEFAULT_PASS) {
    console.error('FATAL: ADMIN_DEFAULT_PASSWORD environment variable is missing.');
    process.exit(1);
}
const ADMIN_EMAILS = ['admin@creatalab.com', 'brianmuema928@gmail.com'];

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function resetPasswords() {
    console.log(`Resetting passwords for: ${ADMIN_EMAILS.join(', ')}...`);
    const passwordHash = bcrypt.hashSync(DEFAULT_PASS, 10);
    
    for (const email of ADMIN_EMAILS) {
        const { error } = await supabase
            .from('admin_users')
            .update({ password_hash: passwordHash })
            .eq('email', email);

        if (error) {
            console.error(`Error resetting ${email}:`, error.message);
        } else {
            console.log(`Successfully reset password for ${email} to ${DEFAULT_PASS}`);
        }
    }
}

resetPasswords();
