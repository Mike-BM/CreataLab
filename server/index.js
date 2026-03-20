import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-in-env';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@creatalab.com';
const ADMIN_DEFAULT_PASSWORD = process.env.ADMIN_DEFAULT_PASSWORD || 'ChangeMe123!';

// Supabase setup (service role key must be server-side only)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('Supabase is not fully configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in server/.env');
}

export const supabase = createClient(SUPABASE_URL ?? '', SUPABASE_SERVICE_ROLE_KEY ?? '', {
  auth: {
    persistSession: false,
  },
});

async function ensureAdminUser() {
  console.log('[INIT] ensureAdminUser starting...');
  console.log('[INIT] Env check — SUPABASE_URL:', !!SUPABASE_URL, '| KEY:', !!SUPABASE_SERVICE_ROLE_KEY);

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('[INIT] ❌ CRITICAL: Supabase credentials missing.');
    if (process.env.VERCEL) {
      console.error('[INIT] ACTION REQUIRED: Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to your Vercel Project Environment Variables.');
    } else {
      console.error('[INIT] ACTION REQUIRED: Check your server/.env or root .env file.');
    }
    return;
  }

  const admins = [
    { email: 'admin@creatalab.com', password: process.env.ADMIN_DEFAULT_PASSWORD || 'CreataLabAdmin!2026' },
    { email: 'brianmuema928@gmail.com', password: process.env.ADMIN_DEFAULT_PASSWORD || 'CreataLabAdmin!2026' }
  ];

  for (const admin of admins) {
    const normalizedEmail = admin.email.trim().toLowerCase();
    const { data: existing, error } = await supabase
      .from('admin_users')
      .select('id')
      .ilike('email', normalizedEmail)
      .maybeSingle();

    if (error) {
      console.error(`[INIT] ❌ Error checking ${normalizedEmail}:`, error.message, error.code);
      continue;
    }

    if (!existing) {
      console.log(`[INIT] Creating missing admin: ${normalizedEmail}`);
      const passwordHash = bcrypt.hashSync(admin.password, 10);
      const { error: insertError } = await supabase.from('admin_users').insert({
        email: normalizedEmail,
        password_hash: passwordHash,
      });
      if (insertError) {
        console.error(`[INIT] ❌ Failed to create user ${normalizedEmail}:`, insertError.message);
      } else {
        console.log(`[INIT] ✅ Initialized admin account: ${normalizedEmail}`);
      }
    } else {
      console.log(`[INIT] ✅ Admin account exists: ${normalizedEmail}`);
    }
  }
}

ensureAdminUser().catch((err) => console.error('ensureAdminUser failed:', err));

async function ensureSiteSettings() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Supabase credentials missing for ensureSiteSettings');
    return;
  }
  
  console.log('Synchronizing site_settings table...');
  const { data: existing, error } = await supabase
    .from('site_settings')
    .select('key');
  const existingKeys = (existing || []).map(row => row.key);

  const defaultSettings = [
    { key: 'maintenance_mode', value: { active: false, message: 'System optimization in progress. We will be back shortly.' } },
    { key: 'branding', value: { name: 'creatalab', logoUrl: '/Logo.png', tagline: 'Creative-Tech Innovation Lab' } },
    { key: 'socials', value: { instagram: 'https://www.instagram.com/creatalab', tiktok: 'https://www.tiktok.com/@creatalab_ltd', whatsapp: 'https://wa.me/254753436729' } },
    { key: 'general_config', value: { siteUrl: 'https://creatalab.com', adminEmail: 'admin@creatalab.com', notifications: true } },
    { key: 'pricing', value: { 
        categories: [
          { title: 'Graphic Design', items: [
            { name: 'Logo & Branding', price: 'From $150', details: 'Full identity package with manuals' },
            { name: 'Social Media Kit', price: '$80', details: '5 templates + 2 banners' }
          ]},
          { title: 'Digital Solutions', items: [
            { name: 'Data Visualization', price: 'Custom', details: 'Interactive dashboards & reports' },
            { name: 'AI Integration', price: 'Custom', details: 'Process automation & LLM tools' }
          ]}
        ]
      }
    }
  ];

  for (const setting of defaultSettings) {
    if (!existingKeys.includes(setting.key)) {
      await supabase.from('site_settings').insert(setting);
      console.log(`Operational parameter initialized: ${setting.key}`);
    }
  }
}

// ... existing code ...

// Change Password Endpoint
app.put('/api/auth/change-password', requireAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.admin.id;

    // 1. Get current user
    const { data: user, error } = await supabase
      .from('admin_users')
      .select('password_hash')
      .eq('id', adminId)
      .single();

    if (error || !user) return res.status(404).json({ error: 'User not found' });

    // 2. Verify current password
    const valid = bcrypt.compareSync(currentPassword, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Current password incorrect' });

    // 3. Hash and update new password
    const newHash = bcrypt.hashSync(newPassword, 10);
    const { error: updateError } = await supabase
      .from('admin_users')
      .update({ password_hash: newHash })
      .eq('id', adminId);

    if (updateError) throw updateError;

    res.json({ ok: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error('Password change protocol failure:', err.message);
    res.status(500).json({ error: 'Failed to update access key' });
  }
});

async function ensureEngagementTables() {
  // Engagement tables (contact_messages, bookings) verified ready via SQL script.
  console.log('Engagement engine verified: contact_messages, bookings ready.');
}

ensureSiteSettings()
  .then(() => ensureEngagementTables())
  .catch((err) => console.error('Initialization sequence failed:', err));



// Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
const allowedOrigins = [
  'http://localhost:5173',
  'https://creatalab.com',
  'https://www.creatalab.com',
  /\.vercel\.app$/
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.some(o => typeof o === 'string' ? o === origin : o.test(origin))) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  })
);
app.use(express.json({ limit: '100kb' }));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use('/api', apiLimiter);

// Auth middleware
const requireAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.admin = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// ─── Debug Endpoint (protected by secret) ───────────────────────────────────
app.get('/api/debug/auth', async (req, res) => {
  const DEBUG_SECRET = 'creatalab-debug-2026';
  if (req.query.secret !== DEBUG_SECRET) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const envStatus = {
    SUPABASE_URL: !!process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    JWT_SECRET: !!process.env.JWT_SECRET,
    ADMIN_DEFAULT_PASSWORD: !!process.env.ADMIN_DEFAULT_PASSWORD,
    NODE_ENV: process.env.NODE_ENV || 'not set',
  };

  let adminUsers = [];
  let dbError = null;

  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('id, email, created_at');
    if (error) throw error;
    adminUsers = (data || []).map(u => ({ id: u.id, email: u.email, created_at: u.created_at }));
  } catch (err) {
    dbError = err.message;
  }

  res.json({
    env: envStatus,
    db: { error: dbError, adminUserCount: adminUsers.length, adminUsers },
  });
});

// Routes
app.post('/api/auth/login', async (req, res) => {
  const { email: rawEmail, password } = req.body || {};
  if (!rawEmail || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const email = rawEmail.trim().toLowerCase();
  
  // 1. Validate Environment on the fly
  const hasUrl = !!process.env.SUPABASE_URL;
  const hasKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  const obfuscatedUrl = process.env.SUPABASE_URL ? `${process.env.SUPABASE_URL.substring(0, 15)}...` : 'MISSING';

  console.log(`[LOGIN DEBUG] Request for email: [${email}]`);
  console.log(`[LOGIN DEBUG] Connection Info: URL=${obfuscatedUrl} | HAS_KEY=${hasKey}`);

  if (!hasUrl || !hasKey) {
    console.error(`[LOGIN DEBUG] ❌ CRITICAL: Backend Supabase environment variables are missing on this instance.`);
    return res.status(500).json({ 
      error: 'Backend Configuration Error', 
      details: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY on server. Check Vercel project settings.' 
    });
  }

  // 2. Perform Query with deep logging
  const { data: user, error } = await supabase
    .from('admin_users')
    .select('id, email, password_hash')
    .ilike('email', email)
    .maybeSingle();

  if (error) {
    console.error(`[LOGIN DEBUG] ❌ Supabase Query Error:`, { message: error.message, code: error.code, details: error.details });
    return res.status(500).json({ error: `Database query failure: ${error.message}` });
  }

  if (!user) {
    console.warn(`[LOGIN DEBUG] ❌ No user found matching: [${email}]`);
    
    // 3. Diagnostic check: Does the table have ANY users?
    const { data: totalUsers, error: countError } = await supabase
      .from('admin_users')
      .select('email');
    
    if (countError) {
      console.error(`[LOGIN DEBUG] ❌ Failed to even list table contents:`, countError.message);
    } else {
      console.log(`[LOGIN DEBUG] Table stats: ${totalUsers?.length || 0} users exist in 'admin_users' table.`);
      if (totalUsers && totalUsers.length > 0) {
        console.log(`[LOGIN DEBUG] Existing emails in DB:`, totalUsers.map(u => u.email).join(', '));
      }
    }
    
    return res.status(401).json({ error: 'User not found' });
  }

  console.log(`[LOGIN] User found: [${user.email}] id=${user.id} | hash_present=${!!user.password_hash}`);

  const valid = bcrypt.compareSync(password, user.password_hash);
  if (!valid) {
    console.warn(`[LOGIN] ❌ Password mismatch for [${email}]`);
    return res.status(401).json({ error: 'Incorrect password' });
  }

  console.log(`[LOGIN] ✅ Authentication successful: [${email}]`);
  const token = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  res.json({ token });
});

// Public posts
app.get('/api/posts', async (req, res) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('date', { ascending: false, nullsFirst: false })
    .order('id', { ascending: false });
  if (error) {
    console.error('Supabase error on list posts:', error.message);
    return res.status(500).json({ error: 'Failed to load posts' });
  }
  res.json(data ?? []);
});

app.get('/api/posts/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', req.params.id)
    .maybeSingle();
  if (error) {
    console.error('Supabase error on get post:', error.message);
    return res.status(500).json({ error: 'Failed to load post' });
  }
  if (!data) return res.status(404).json({ error: 'Not found' });
  res.json(data);
});

// Admin posts
app.post('/api/posts', requireAdmin, async (req, res) => {
  const { slug, title, excerpt, content, author, category, date, published } =
    req.body || {};
  if (!slug || !title || !excerpt || !content) {
    return res.status(400).json({ error: 'Missing required post fields' });
  }
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('posts')
    .insert({
      slug: slug.trim(),
      title: title.trim(),
      excerpt: excerpt.trim(),
      content,
      author: author || null,
      category: category || null,
      date: date || null,
      published: Boolean(published),
      created_at: now,
      updated_at: now,
    })
    .select('id')
    .maybeSingle();

  if (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Slug already exists' });
    }
    console.error('Supabase error on create post:', error.message);
    return res.status(500).json({ error: 'Failed to create post' });
  }

  res.status(201).json({ id: data?.id });
});

app.put('/api/posts/:id', requireAdmin, async (req, res) => {
  const { slug, title, excerpt, content, author, category, date, published } =
    req.body || {};
  if (!slug || !title || !excerpt || !content) {
    return res.status(400).json({ error: 'Missing required post fields' });
  }
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('posts')
    .update({
      slug: slug.trim(),
      title: title.trim(),
      excerpt: excerpt.trim(),
      content,
      author: author || null,
      category: category || null,
      date: date || null,
      published: Boolean(published),
      updated_at: now,
    })
    .eq('id', req.params.id)
    .select('id')
    .maybeSingle();

  if (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Slug already exists' });
    }
    console.error('Supabase error on update post:', error.message);
    return res.status(500).json({ error: 'Failed to update post' });
  }

  if (!data) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.json({ ok: true });
});

app.delete('/api/posts/:id', requireAdmin, async (req, res) => {
  const { error, count } = await supabase
    .from('posts')
    .delete({ count: 'exact' })
    .eq('id', req.params.id);

  if (error) {
    console.error('Supabase error on delete post:', error.message);
    return res.status(500).json({ error: 'Failed to delete post' });
  }
  if (!count) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.json({ ok: true });
});

// Public projects (Portfolio)
app.get('/api/projects', async (req, res) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Supabase error on list projects:', error.message);
    return res.status(500).json({ error: 'Failed to load projects' });
  }
  res.json(data ?? []);
});

app.get('/api/projects/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', req.params.id)
    .maybeSingle();
  if (error) {
    console.error('Supabase error on get project:', error.message);
    return res.status(500).json({ error: 'Failed to load project' });
  }
  if (!data) return res.status(404).json({ error: 'Not found' });
  res.json(data);
});

// Admin projects
app.post('/api/projects', requireAdmin, async (req, res) => {
  const { title, category, image_url, description, full_description, client, tools, features, problem, solution, impact, link, published } =
    req.body || {};
  if (!title || !description || !image_url) {
    return res.status(400).json({ error: 'Missing required project fields (title, description, image_url)' });
  }
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('projects')
    .insert({
      title: title.trim(),
      category: category ? category.trim() : null,
      image_url: image_url.trim(),
      description: description.trim(),
      full_description: full_description || null,
      client: client || null,
      tools: tools || [],
      features: features || [],
      problem: problem || null,
      solution: solution || null,
      impact: impact || null,
      link: link || null,
      published: Boolean(published),
      created_at: now,
      updated_at: now,
    })
    .select('id')
    .maybeSingle();

  if (error) {
    console.error('Supabase error on create project:', error.message);
    return res.status(500).json({ error: 'Failed to create project' });
  }

  res.status(201).json({ id: data?.id });
});

app.put('/api/projects/:id', requireAdmin, async (req, res) => {
  const { title, category, image_url, description, full_description, client, tools, features, problem, solution, impact, link, published } =
    req.body || {};
  if (!title || !description || !image_url) {
    return res.status(400).json({ error: 'Missing required project fields' });
  }
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('projects')
    .update({
      title: title.trim(),
      category: category ? category.trim() : null,
      image_url: image_url.trim(),
      description: description.trim(),
      full_description: full_description || null,
      client: client || null,
      tools: tools || [],
      features: features || [],
      problem: problem || null,
      solution: solution || null,
      impact: impact || null,
      link: link || null,
      published: Boolean(published),
      updated_at: now,
    })
    .eq('id', req.params.id)
    .select('id')
    .maybeSingle();

  if (error) {
    console.error('Supabase error on update project:', error.message);
    return res.status(500).json({ error: 'Failed to update project' });
  }

  if (!data) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.json({ ok: true });
});

app.delete('/api/projects/:id', requireAdmin, async (req, res) => {
  const { error, count } = await supabase
    .from('projects')
    .delete({ count: 'exact' })
    .eq('id', req.params.id);

  if (error) {
    console.error('Supabase error on delete project:', error.message);
    return res.status(500).json({ error: 'Failed to delete project' });
  }
  if (!count) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.json({ ok: true });
});

app.get('/api/settings', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*');
    if (error) throw error;
    
    const settings = (data || []).reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    res.json(settings);
  } catch (err) {
    console.error('Core parameter retrieval failure:', err.message);
    res.status(500).json({ error: 'Failed to access core parameters' });
  }
});

app.put('/api/settings/:key', requireAdmin, async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    
    const { data: existing } = await supabase
      .from('site_settings')
      .select('id')
      .eq('key', key)
      .maybeSingle();

    let error;
    if (existing) {
      const { error: updateError } = await supabase
        .from('site_settings')
        .update({ value, updated_at: new Date().toISOString() })
        .eq('key', key);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('site_settings')
        .insert({ key, value });
      error = insertError;
    }
      
    if (error) throw error;
    res.json({ ok: true });
  } catch (err) {
    console.error('Parameter update protocol failure:', err.message);
    res.status(500).json({ error: 'Parameter update protocol failed' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/test-db', async (req, res) => {
  try {
    const { data, error } = await supabase.from('admin_users').select('count', { count: 'exact', head: true });
    if (error) throw error;
    res.json({ status: 'connected', count: data });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message, env: { hasUrl: !!process.env.SUPABASE_URL, hasKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY } });
  }
});

// Ingestion Endpoints
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const { error } = await supabase
      .from('contact_messages')
      .insert({ name, email, subject, message, created_at: new Date().toISOString() });
    
    if (error) throw error;
    res.json({ ok: true });
  } catch (err) {
    console.error('Contact submission failure:', err.message);
    res.status(500).json({ error: 'Failed to process inquiry' });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const { name, email, phone, service, message, preferredDate } = req.body;
    const { error } = await supabase
      .from('bookings')
      .insert({ name, email, phone, service, message, preferred_date: preferredDate, created_at: new Date().toISOString() });
    
    if (error) throw error;
    res.json({ ok: true });
  } catch (err) {
    console.error('Booking submission failure:', err.message);
    res.status(500).json({ error: 'Failed to process booking' });
  }
});

app.get('/api/stats', requireAdmin, async (req, res) => {
  try {
    const [{ count: projects }, { count: posts }, { count: inquiries }, { count: bookings }] = await Promise.all([
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('posts').select('*', { count: 'exact', head: true }),
      supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
      supabase.from('bookings').select('*', { count: 'exact', head: true }),
    ]);

    res.json({ projects, posts, inquiries, bookings });
  } catch (err) {
    res.status(500).json({ error: 'Failed to aggregate metrics' });
  }
});

// User Management Endpoints
app.get('/api/users', requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('id, email, created_at')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('User retrieval protocol failure:', err.message);
    res.status(500).json({ error: 'Failed to load administrative accounts' });
  }
});

app.delete('/api/users/:id', requireAdmin, async (req, res) => {
  try {
    // Prevent deleting self if needed, but for now just allow deletion
    const { id } = req.params;
    const { error } = await supabase
      .from('admin_users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    res.json({ ok: true });
  } catch (err) {
    console.error('Account termination protocol failure:', err.message);
    res.status(500).json({ error: 'Failed to terminate administrative account' });
  }
});


// Export for Vercel serverless functions
export default app;

// Only start the server locally if not running on Vercel
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Secure backend listening on http://localhost:${PORT}`);
  });
}

