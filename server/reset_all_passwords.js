import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const adminPass = process.env.ADMIN_DEFAULT_PASSWORD;
if (!adminPass) {
  console.error("FATAL: ADMIN_DEFAULT_PASSWORD must be set in .env.");
  process.exit(1);
}

const adminsToReset = [
  { email: 'admin@creatalab.com', newPass: adminPass },
  { email: 'brianmuema928@gmail.com', newPass: adminPass }
];

async function resetAllPasswords() {
    console.log('Starting full credential reset...');
    for (const admin of adminsToReset) {
        const passwordHash = bcrypt.hashSync(admin.newPass, 10);
        const { error } = await supabase
            .from('admin_users')
            .update({ password_hash: passwordHash })
            .eq('email', admin.email);

        if (error) {
            console.error(`Error resetting password for ${admin.email}:`, error.message);
        } else {
            console.log(`Successfully reset password for ${admin.email}`);
        }
    }
    console.log('Reset complete.');
}

resetAllPasswords();
