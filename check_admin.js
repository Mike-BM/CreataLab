import 'dotenv/config';
import express from 'express';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@creatalab.com';
const ADMIN_DEFAULT_PASSWORD = process.env.ADMIN_DEFAULT_PASSWORD || 'ChangeMe123!';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function checkAdmin() {
    console.log('Checking admin user in Supabase...');
    const { data: user, error } = await supabase
        .from('admin_users')
        .select('id, email, password_hash')
        .eq('email', ADMIN_EMAIL)
        .maybeSingle();

    if (error) {
        console.error('Supabase error:', error.message);
        return;
    }

    if (!user) {
        console.log('Admin user not found. Run server to create it.');
        return;
    }

    const valid = bcrypt.compareSync(ADMIN_DEFAULT_PASSWORD, user.password_hash);
    console.log('Admin user found:', user.email);
    console.log('Default password valid:', valid);
}

checkAdmin();
