import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PASSWORD = process.env.ADMIN_DEFAULT_PASSWORD || 'CreataLabAdmin!2026';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

async function main() {
  console.log('=== Admin Portal Diagnostic ===\n');
  console.log(`Supabase URL: ${SUPABASE_URL}`);
  console.log(`Target password: ${PASSWORD}\n`);

  // 1. Check if admin_users table exists and fetch rows
  const { data: users, error: fetchError } = await supabase
    .from('admin_users')
    .select('id, email, password_hash, created_at')
    .order('created_at', { ascending: false });

  if (fetchError) {
    console.error('❌ Could not query admin_users table:', fetchError.message);
    console.error('   Code:', fetchError.code);
    console.error('\n💡 The table may not exist. Run supabase_init.sql in the Supabase SQL editor.');
    process.exit(1);
  }

  console.log(`✅ admin_users table found. Row count: ${users.length}`);

  if (users.length === 0) {
    console.warn('\n⚠️  No admin users found in database! Creating them now...');
  } else {
    console.log('\nExisting admin users:');
    for (const u of users) {
      const hashValid = u.password_hash && u.password_hash.startsWith('$2');
      const passwordMatches = u.password_hash ? bcrypt.compareSync(PASSWORD, u.password_hash) : false;
      console.log(`  - ${u.email}`);
      console.log(`    Hash valid: ${hashValid ? '✅' : '❌'}`);
      console.log(`    Password matches "${PASSWORD}": ${passwordMatches ? '✅' : '❌'}`);
    }
  }

  // 2. Upsert the two admin accounts with a fresh hash
  const admins = [
    'admin@creatalab.com',
    'brianmuema928@gmail.com'
  ];

  console.log('\n--- Ensuring admin accounts are correct ---');
  for (const email of admins) {
    const normalizedEmail = email.trim().toLowerCase();
    const passwordHash = bcrypt.hashSync(PASSWORD, 10);

    // Check if user exists
    const { data: existing } = await supabase
      .from('admin_users')
      .select('id, email')
      .ilike('email', normalizedEmail)
      .maybeSingle();

    if (existing) {
      // Update hash
      const { error: updateErr } = await supabase
        .from('admin_users')
        .update({ password_hash: passwordHash })
        .eq('id', existing.id);

      if (updateErr) {
        console.error(`❌ Failed to update ${normalizedEmail}:`, updateErr.message);
      } else {
        console.log(`✅ Updated password hash for: ${normalizedEmail}`);
      }
    } else {
      // Insert
      const { error: insertErr } = await supabase
        .from('admin_users')
        .insert({ email: normalizedEmail, password_hash: passwordHash });

      if (insertErr) {
        console.error(`❌ Failed to insert ${normalizedEmail}:`, insertErr.message);
        console.error('   Detail:', insertErr.details);
      } else {
        console.log(`✅ Created admin account: ${normalizedEmail}`);
      }
    }
  }

  // 3. Final verification
  console.log('\n--- Final Verification ---');
  const { data: final } = await supabase
    .from('admin_users')
    .select('id, email, password_hash')
    .order('created_at', { ascending: false });

  for (const u of final || []) {
    const ok = u.password_hash ? bcrypt.compareSync(PASSWORD, u.password_hash) : false;
    console.log(`  ${ok ? '✅' : '❌'} ${u.email} — login with password: ${ok ? 'WORKS' : 'BROKEN'}`);
  }

  console.log('\n=== Done ===');
  console.log(`\nLogin credentials:`);
  console.log(`  Email:    admin@creatalab.com`);
  console.log(`  Password: ${PASSWORD}`);
  console.log(`\nOr:`);
  console.log(`  Email:    brianmuema928@gmail.com`);
  console.log(`  Password: ${PASSWORD}`);
}

main().catch(err => {
  console.error('Script failed:', err.message);
  process.exit(1);
});
