import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const adminsToReset = [
  { email: 'admin@creatalab.com', newPass: 'CreataLabAdmin!2026' },
  { email: 'brianmuema928@gmail.com', newPass: 'BrianSecure@2026' }
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
