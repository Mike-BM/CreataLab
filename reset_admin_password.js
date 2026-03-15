import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DEFAULT_PASS = 'ChangeMe123!';
const TARGET_EMAIL = 'brianmuema928@gmail.com';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function resetPassword() {
    console.log(`Resetting password for ${TARGET_EMAIL}...`);
    const passwordHash = bcrypt.hashSync(DEFAULT_PASS, 10);
    
    const { error } = await supabase
        .from('admin_users')
        .update({ password_hash: passwordHash })
        .eq('email', TARGET_EMAIL);

    if (error) {
        console.error('Error:', error.message);
    } else {
        console.log(`Successfully reset password for ${TARGET_EMAIL} to ${DEFAULT_PASS}`);
    }
}

resetPassword();
