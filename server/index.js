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
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return;

  const { data: existing, error } = await supabase
    .from('admin_users')
    .select('id')
    .eq('email', ADMIN_EMAIL)
    .maybeSingle();

  if (error) {
    console.error('Error checking admin_users in Supabase:', error.message);
    return;
  }

  if (!existing) {
    const passwordHash = bcrypt.hashSync(ADMIN_DEFAULT_PASSWORD, 10);
    const { error: insertError } = await supabase.from('admin_users').insert({
      email: ADMIN_EMAIL,
      password_hash: passwordHash,
    });
    if (insertError) {
      console.error('Failed to create default admin user in Supabase:', insertError.message);
    } else {
      console.log(`Created default admin user ${ADMIN_EMAIL} in Supabase. Change this password in production.`);
    }
  }
}

ensureAdminUser().catch((err) => console.error('ensureAdminUser failed:', err));

// Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
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

// Routes
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  const { data: user, error } = await supabase
    .from('admin_users')
    .select('id, email, password_hash')
    .eq('email', email)
    .maybeSingle();
  if (error) {
    console.error('Supabase error on login:', error.message);
    return res.status(500).json({ error: 'Login failed' });
  }
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = bcrypt.compareSync(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  res.json({ token });
});

app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body || {};
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const now = new Date().toISOString();
  const { error } = await supabase.from('contact_messages').insert({
    name: name.trim(),
    email: email.trim(),
    subject: subject.trim(),
    message: message.trim(),
    created_at: now,
  });
  if (error) {
    console.error('Supabase error on contact:', error.message);
    return res.status(500).json({ error: 'Failed to save message' });
  }
  res.status(201).json({ ok: true });
});

app.post('/api/bookings', async (req, res) => {
  const { name, email, phone, service, message, preferredDate } = req.body || {};
  if (!name || !email || !service || !message) {
    return res.status(400).json({ error: 'Missing required booking fields' });
  }
  const now = new Date().toISOString();
  const { error } = await supabase.from('bookings').insert({
    name: name.trim(),
    email: email.trim(),
    phone: (phone || '').trim(),
    service,
    message: message.trim(),
    preferred_date: preferredDate || null,
    created_at: now,
  });
  if (error) {
    console.error('Supabase error on bookings:', error.message);
    return res.status(500).json({ error: 'Failed to submit booking' });
  }
  res.status(201).json({ ok: true });
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
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
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
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
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

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Export for Vercel serverless functions
export default app;

// Only start the server locally if not running on Vercel
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Secure backend listening on http://localhost:${PORT}`);
  });
}

