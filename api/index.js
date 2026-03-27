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

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase;
try {
  supabase = createClient(SUPABASE_URL || 'http://localhost:8080', SUPABASE_SERVICE_ROLE_KEY || 'no-key', {
    auth: { persistSession: false },
  });
} catch (err) {
  console.error('CRITICAL: Failed to initialize Supabase client:', err.message);
}

export { supabase };

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

app.get('/api/debug/env', asyncHandler(async (req, res) => {
  const report = {
    hasSupabaseUrl: !!process.env.SUPABASE_URL,
    hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    hasJwtSecret: !!process.env.JWT_SECRET,
    hasResendKey: !!process.env.RESEND_API_KEY,
    nodeEnv: process.env.NODE_ENV,
    dbStatus: 'testing...'
  };
  
  try {
    const { data, error } = await supabase.from('projects').select('id').limit(1);
    report.dbStatus = error ? `Error: ${error.message}` : (data?.length >= 0 ? 'Connected' : 'Unexpected response');
  } catch (err) {
    report.dbStatus = `Catch: ${err.message}`;
  }
  
  res.json(report);
}));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.post('/api/auth/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  const { data: user } = await supabase.from('admin_users').select('*').ilike('email', (email || '').trim().toLowerCase()).maybeSingle();
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token });
}));

app.put('/api/auth/change-password', requireAdmin, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const { data: user } = await supabase.from('admin_users').select('password_hash').eq('id', req.admin.id).single();
  if (!user || !bcrypt.compareSync(currentPassword, user.password_hash)) {
    return res.status(401).json({ error: 'Current password incorrect' });
  }
  await supabase.from('admin_users').update({ password_hash: bcrypt.hashSync(newPassword, 10) }).eq('id', req.admin.id);
  res.json({ ok: true });
}));

app.get('/api/posts', asyncHandler(async (req, res) => {
  const { data } = await supabase.from('posts').select('*').eq('published', true).order('date', { ascending: false });
  res.json(data || []);
}));

app.get('/api/admin/posts', requireAdmin, asyncHandler(async (req, res) => {
  const { data } = await supabase.from('posts').select('*').order('date', { ascending: false });
  res.json(data || []);
}));

app.get('/api/posts/:id', asyncHandler(async (req, res) => {
  const { data } = await supabase.from('posts').select('*').eq('id', req.params.id).single();
  if (!data) return res.status(404).json({ error: 'Post not found' });
  res.json(data);
}));

app.get('/api/projects', asyncHandler(async (req, res) => {
  const { data } = await supabase.from('projects').select('*').eq('published', true).order('created_at', { ascending: false });
  res.json(data || []);
}));

app.get('/api/admin/projects', requireAdmin, asyncHandler(async (req, res) => {
  const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
  res.json(data || []);
}));

app.get('/api/projects/:id', asyncHandler(async (req, res) => {
  const { data } = await supabase.from('projects').select('*').eq('id', req.params.id).single();
  if (!data) return res.status(404).json({ error: 'Project not found' });
  res.json(data);
}));

app.get('/api/settings', asyncHandler(async (req, res) => {
  const { data } = await supabase.from('site_settings').select('*');
  const settings = (data || []).reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});
  res.json(settings);
}));

app.put('/api/settings/:key', requireAdmin, asyncHandler(async (req, res) => {
  const { key } = req.params;
  const { value } = req.body;
  const { data: existing } = await supabase.from('site_settings').select('id').eq('key', key).maybeSingle();
  if (existing) {
    await supabase.from('site_settings').update({ value, updated_at: new Date().toISOString() }).eq('key', key);
  } else {
    await supabase.from('site_settings').insert({ key, value });
  }
  res.json({ ok: true });
}));

app.get('/api/stats', requireAdmin, asyncHandler(async (req, res) => {
  const [projectsRes, postsRes, inquiriesRes, bookingsRes, analyticsRes] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('posts').select('*', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
    supabase.from('site_settings').select('value').eq('key', 'analytics_data').maybeSingle()
  ]);
  
  const analytics = analyticsRes.data?.value || {};
  res.json({ 
    projects: projectsRes.count || 0, 
    posts: postsRes.count || 0, 
    inquiries: inquiriesRes.count || 0, 
    bookings: bookingsRes.count || 0,
    pageViews: analytics.totalViews || 0,
    topPaths: Object.entries(analytics.paths || {}).map(([path, count]) => ({ path, count }))
  });
}));

app.post('/api/track', async (req, res) => {
  const { path } = req.body;
  if (!path || path.startsWith('/admin')) return res.json({ ok: true });
  
  try {
    const { data: existing } = await supabase.from('site_settings').select('id, value').eq('key', 'analytics_data').maybeSingle();
    let analytics = existing?.value || { totalViews: 0, paths: {} };
    
    analytics.totalViews = (analytics.totalViews || 0) + 1;
    analytics.paths[path] = (analytics.paths[path] || 0) + 1;
    
    // Sort and limit to top 20 paths
    const sortedPaths = Object.entries(analytics.paths).sort((a,b) => b[1]-a[1]).slice(0, 20);
    analytics.paths = Object.fromEntries(sortedPaths);
    
    if (existing) {
      await supabase.from('site_settings').update({ value: analytics }).eq('key', 'analytics_data');
    } else {
      await supabase.from('site_settings').insert({ key: 'analytics_data', value: analytics });
    }
    res.json({ ok: true });
  } catch(e) {
    console.error('Tracking Error:', e);
    res.json({ ok: false });
  }
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

app.get('/api/contact', requireAdmin, asyncHandler(async (req, res) => {
  const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
  res.json(data || []);
}));

app.post('/api/bookings', asyncHandler(async (req, res) => {
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
}));

app.get('/api/bookings', requireAdmin, asyncHandler(async (req, res) => {
  const { data } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
  res.json(data || []);
}));

// Admin Users Management
app.get('/api/users', requireAdmin, asyncHandler(async (req, res) => {
  const { data } = await supabase.from('admin_users').select('id, email, created_at');
  res.json(data || []);
}));

app.delete('/api/users/:id', requireAdmin, asyncHandler(async (req, res) => {
  // Prevent admin from deleting themselves if they are the only ones (optional but good)
  const { count } = await supabase.from('admin_users').select('*', { count: 'exact', head: true });
  if (count <= 1) return res.status(400).json({ error: 'Cannot remove the last administrative account' });
  
  await supabase.from('admin_users').delete().eq('id', req.params.id);
  res.json({ ok: true });
}));

// Admin management routes (simplified for brevity)
app.post('/api/projects', requireAdmin, asyncHandler(async (req, res) => {
  const { data } = await supabase.from('projects').insert({ ...req.body, created_at: new Date().toISOString() }).select('id').single();
  res.status(201).json(data);
}));
app.put('/api/projects/:id', requireAdmin, asyncHandler(async (req, res) => {
  console.log(`[DB UPDATE] Started for project ${req.params.id}`);
  
  // Sanitize: never try to update the ID column or created_at
  const { id, created_at, ...updateData } = req.body;
  
  console.log('[DB UPDATE] Payload Keys:', Object.keys(updateData));
  if (updateData.link !== undefined) console.log('[DB UPDATE] New Link Value:', updateData.link);

  const { data, error } = await supabase.from('projects')
    .update({ ...updateData, updated_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .select();
  
  if (error) {
    console.error('[DB UPDATE] Error:', error);
    return res.status(500).json({ error: error.message });
  }
  
  console.log('[DB UPDATE] Success. Records affected:', data?.length);
  res.json({ ok: true, data });
}));

app.delete('/api/projects/:id', requireAdmin, asyncHandler(async (req, res) => {
  console.log(`[DB DELETE] Trying to delete project ${req.params.id}`);
  const { data, error } = await supabase.from('projects').delete().eq('id', req.params.id).select();
  if (error) {
    console.error('[DB DELETE] Error:', error);
    return res.status(500).json({ error: error.message });
  }
  if (!data || data.length === 0) {
    console.warn(`[DB DELETE] Project ${req.params.id} not found in Supabase!`);
    return res.status(404).json({ error: 'Project not found' });
  }
  console.log(`[DB DELETE] Successfully deleted project ${req.params.id} from Supabase.`);
  res.json({ ok: true });
}));

app.post('/api/posts', requireAdmin, asyncHandler(async (req, res) => {
  const { data } = await supabase.from('posts').insert({ ...req.body, created_at: new Date().toISOString() }).select('id').single();
  res.status(201).json(data);
}));
app.put('/api/posts/:id', requireAdmin, asyncHandler(async (req, res) => {
  await supabase.from('posts').update({ ...req.body, updated_at: new Date().toISOString() }).eq('id', req.params.id);
  res.json({ ok: true });
}));
app.delete('/api/posts/:id', requireAdmin, asyncHandler(async (req, res) => {
  await supabase.from('posts').delete().eq('id', req.params.id);
  res.json({ ok: true });
}));

// Execute startup initialization
initializeSystem().catch(err => console.error('Startup Error:', err));

export default app;

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
}
