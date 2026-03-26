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

// Supabase setup
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('CRITICAL: Supabase environment variables are missing!');
}

export const supabase = createClient(SUPABASE_URL ?? '', SUPABASE_SERVICE_ROLE_KEY ?? '', {
  auth: { persistSession: false },
});

// Middleware to catch async errors
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
        console.error('API Error:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    });
};

// Initialization Logic (runs on cold start)
async function initializeSystem() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return;
  
  // Ensure Admin
  const admins = [
    { email: 'admin@creatalab.com', password: process.env.ADMIN_DEFAULT_PASSWORD || 'CreataLabAdmin!2026' },
    { email: 'brianmuema928@gmail.com', password: process.env.ADMIN_DEFAULT_PASSWORD || 'CreataLabAdmin!2026' }
  ];
  for (const admin of admins) {
    const { data: existing } = await supabase.from('admin_users').select('id').ilike('email', admin.email.trim().toLowerCase()).maybeSingle();
    if (!existing) {
      await supabase.from('admin_users').insert({
        email: admin.email.trim().toLowerCase(),
        password_hash: bcrypt.hashSync(admin.password, 10),
      });
    }
  }

  // Ensure Settings
  const { data: settings } = await supabase.from('site_settings').select('key');
  const existingKeys = (settings || []).map(row => row.key);
  const defaultSettings = [
    { key: 'maintenance_mode', value: { active: false, message: 'System optimization in progress.' } },
    { key: 'branding', value: { name: 'creatalab', logoUrl: '/Logo.png', tagline: 'Creative-Tech Innovation Lab' } },
    { key: 'socials', value: { instagram: 'https://instagram.com/creatalab', whatsapp: '254753436729' } },
    { key: 'pricing', value: { categories: [
      { title: 'Brand & Creative', items: [
        { name: 'Identity Essentials', price: 'KSH 45,000', details: 'Logo, Palette, Fonts' },
        { name: 'Core Brand Design', price: 'KSH 85,000', details: 'Full Identity + Basic Assets' },
        { name: 'Premium Brand Experience', price: 'Contact', details: 'Digital-First Brand Ecosystem' }
      ]},
      { title: 'Digital & Web', items: [
        { name: 'Professional Site', price: 'KSH 65,000', details: 'Custom Design, SEO, Mobile Ready' },
        { name: 'E-Commerce Solution', price: 'KSH 150,000', details: 'Payments, Inventory, CRM' },
        { name: 'Complex Application', price: 'Contact', details: 'Full-Stack Dashboards' }
      ]}
    ] } }
  ];
  for (const s of defaultSettings) {
    if (!existingKeys.includes(s.key)) await supabase.from('site_settings').insert(s);
  }
}
initializeSystem().catch(console.error);

// Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '100kb' }));

const requireAdmin = (req, res, next) => {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.admin = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// API Routes
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  const { data: user } = await supabase.from('admin_users').select('*').ilike('email', (email || '').trim().toLowerCase()).maybeSingle();
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token });
});

app.put('/api/auth/change-password', requireAdmin, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const { data: user } = await supabase.from('admin_users').select('password_hash').eq('id', req.admin.id).single();
  if (!user || !bcrypt.compareSync(currentPassword, user.password_hash)) {
    return res.status(401).json({ error: 'Current password incorrect' });
  }
  await supabase.from('admin_users').update({ password_hash: bcrypt.hashSync(newPassword, 10) }).eq('id', req.admin.id);
  res.json({ ok: true });
});

app.get('/api/posts', async (req, res) => {
  const { data } = await supabase.from('posts').select('*').eq('published', true).order('date', { ascending: false });
  res.json(data || []);
});

app.get('/api/posts/:id', async (req, res) => {
  const { data } = await supabase.from('posts').select('*').eq('id', req.params.id).single();
  if (!data) return res.status(404).json({ error: 'Post not found' });
  res.json(data);
});

app.get('/api/projects', async (req, res) => {
  const { data } = await supabase.from('projects').select('*').eq('published', true).order('created_at', { ascending: false });
  res.json(data || []);
});

app.get('/api/projects/:id', async (req, res) => {
  const { data } = await supabase.from('projects').select('*').eq('id', req.params.id).single();
  if (!data) return res.status(404).json({ error: 'Project not found' });
  res.json(data);
});

app.get('/api/settings', async (req, res) => {
  const { data } = await supabase.from('site_settings').select('*');
  const settings = (data || []).reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});
  res.json(settings);
});

app.put('/api/settings/:key', requireAdmin, async (req, res) => {
  const { key } = req.params;
  const { value } = req.body;
  const { data: existing } = await supabase.from('site_settings').select('id').eq('key', key).maybeSingle();
  if (existing) {
    await supabase.from('site_settings').update({ value, updated_at: new Date().toISOString() }).eq('key', key);
  } else {
    await supabase.from('site_settings').insert({ key, value });
  }
  res.json({ ok: true });
});

app.get('/api/stats', requireAdmin, async (req, res) => {
  const [projects, posts, inquiries, bookings] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('posts').select('*', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
  ]);
  res.json({ projects: projects.count, posts: posts.count, inquiries: inquiries.count, bookings: bookings.count });
});

// Utility to send emails via Resend API (no external dependency needed)
async function sendNotificationEmail(subject, html) {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL || 'brianmuema928@gmail.com';
  
  if (!apiKey) {
    console.log('Skipping email notification: RESEND_API_KEY missing');
    return;
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: 'CreataLab <onboarding@resend.dev>',
        to: adminEmail,
        subject: `[CreataLab] ${subject}`,
        html: html
      })
    });
    if (!res.ok) {
      const error = await res.text();
      console.error('Resend API error:', error);
    } else {
      console.log('Notification email sent successfully');
    }
  } catch (err) {
    console.error('Failed to send notification email:', err);
  }
}

app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  const { data, error } = await supabase.from('contact_messages').insert({ 
    name, email, subject, message, created_at: new Date().toISOString() 
  });
  
  // Fire and forget email notification
  sendNotificationEmail(
    `New Contact Message: ${subject}`,
    `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #6d28d9;">New Message Received</h2>
      <p><strong>From:</strong> ${name} (&lt;${email}&gt;)</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="white-space: pre-wrap;">${message}</p>
    </div>`
  ).catch(console.error);

  res.json({ ok: true });
});

app.get('/api/contact', requireAdmin, async (req, res) => {
  const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
  res.json(data || []);
});

app.post('/api/bookings', async (req, res) => {
  const { name, email, phone, service, message, preferredDate } = req.body;
  const { data, error } = await supabase.from('bookings').insert({ 
    name, email, phone, service, message, preferred_date: preferredDate, created_at: new Date().toISOString() 
  });
  
  // Fire and forget email notification
  sendNotificationEmail(
    `New Booking Request: ${service}`,
    `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #ec4899;">New Booking Request</h2>
      <p><strong>From:</strong> ${name} (&lt;${email}&gt;)</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Service:</strong> ${service}</p>
      <p><strong>Preferred Date:</strong> ${preferredDate || 'Not specified'}</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="white-space: pre-wrap;"><strong>Details:</strong><br/>${message}</p>
    </div>`
  ).catch(console.error);

  res.json({ ok: true });
});

app.get('/api/bookings', requireAdmin, async (req, res) => {
  const { data } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
  res.json(data || []);
});

// Admin Users Management
app.get('/api/users', requireAdmin, async (req, res) => {
  const { data } = await supabase.from('admin_users').select('id, email, created_at');
  res.json(data || []);
});

app.delete('/api/users/:id', requireAdmin, async (req, res) => {
  // Prevent admin from deleting themselves if they are the only ones (optional but good)
  const { count } = await supabase.from('admin_users').select('*', { count: 'exact', head: true });
  if (count <= 1) return res.status(400).json({ error: 'Cannot remove the last administrative account' });
  
  await supabase.from('admin_users').delete().eq('id', req.params.id);
  res.json({ ok: true });
});

// Admin management routes (simplified for brevity)
app.post('/api/projects', requireAdmin, async (req, res) => {
  const { data } = await supabase.from('projects').insert({ ...req.body, created_at: new Date().toISOString() }).select('id').single();
  res.status(201).json(data);
});
app.put('/api/projects/:id', requireAdmin, async (req, res) => {
  console.log(`Updating project ${req.params.id} with body:`, req.body);
  
  // Sanitize: never try to update the ID column
  const { id, created_at, ...updateData } = req.body;
  
  const { data, error } = await supabase.from('projects')
    .update({ ...updateData, updated_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .select();
  
  if (error) {
    console.error('Update Error:', error);
    return res.status(500).json({ error: error.message });
  }
  
  console.log('Update Success:', data);
  res.json({ ok: true, data });
});

app.delete('/api/projects/:id', requireAdmin, async (req, res) => {
  const { error } = await supabase.from('projects').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

app.post('/api/posts', requireAdmin, async (req, res) => {
  const { data } = await supabase.from('posts').insert({ ...req.body, created_at: new Date().toISOString() }).select('id').single();
  res.status(201).json(data);
});
app.put('/api/posts/:id', requireAdmin, async (req, res) => {
  await supabase.from('posts').update({ ...req.body, updated_at: new Date().toISOString() }).eq('id', req.params.id);
  res.json({ ok: true });
});
app.delete('/api/posts/:id', requireAdmin, async (req, res) => {
  await supabase.from('posts').delete().eq('id', req.params.id);
  res.json({ ok: true });
});

export default app;

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
}
