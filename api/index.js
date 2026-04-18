import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import multer from 'multer';

const app = express();
app.set('trust proxy', 1); // Enable IP tracking behind proxies like Vercel
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("FATAL: JWT_SECRET environment variable is missing.");
}

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
  const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD;
  if (!adminPassword) {
    console.warn("WARNING: ADMIN_DEFAULT_PASSWORD is not set. Default administrators may not be created.");
  }
  const admins = [
    { email: 'admin@creatalab.com', password: adminPassword },
    { email: 'brianmuema928@gmail.com', password: adminPassword }
  ].filter(a => a.password);
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
      { title: 'Web Development', items: [
        { name: 'Starter Website', price: 'KES 5,000', details: 'Perfect for small businesses & personal portfolios' },
        { name: 'Business Website', price: 'KES 15,000', details: 'Full booking systems & custom business platforms' },
        { name: 'Custom Application', price: 'Contact', details: 'Complex full-stack dashboards & custom logic' }
      ]},
      { title: 'Design & Branding', items: [
        { name: 'Poster Design', price: 'KES 500', details: 'High-impact social media & event posters' },
        { name: 'Logo Design', price: 'KES 3,000', details: 'Unique, professional brand identity kits' },
        { name: 'Brand Strategy', price: 'KES 10,000', details: 'Full identity + social media guidelines' }
      ]}
    ] } }
  ];
  for (const s of defaultSettings) {
    if (!existingKeys.includes(s.key)) await supabase.from('site_settings').insert(s);
  }
}
initializeSystem().catch(console.error);

// Rate Limiting Config
const globalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300, message: { error: 'Too many requests, please slow down.' } });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 15, message: { error: 'Too many login attempts. Try again in 15 minutes.' } });
const emailLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 3, message: { error: 'Message limit reached (3 per hour). Try again later.' } });

// Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ 
  origin: process.env.NODE_ENV === 'production' 
    ? (process.env.FRONTEND_URL ? [process.env.FRONTEND_URL, /\.vercel\.app$/] : true) 
    : true, 
  credentials: true 
}));
app.use(express.json({ limit: '100kb' }));
app.use('/api/', globalLimiter); // Protect all API endpoints globally

const requireAdmin = asyncHandler(async (req, res, next) => {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Security check: ensure user account still exists
    const { data: user } = await supabase.from('admin_users').select('id').eq('id', decoded.id).maybeSingle();
    if (!user) return res.status(401).json({ error: 'Account has been deactivated or deleted.' });
    
    req.admin = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

app.get('/api/debug/env', asyncHandler(async (req, res) => {
  const report = {
    hasSupabaseUrl: !!process.env.SUPABASE_URL,
    hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    hasJwtSecret: !!process.env.JWT_SECRET,
    hasResendKey: !!process.env.RESEND_API_KEY,
    hasRecaptchaSecret: !!process.env.RECAPTCHA_SECRET_KEY,
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

app.post('/api/auth/login', authLimiter, asyncHandler(async (req, res) => {
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
    uniqueVisitors: analytics.uniqueVisitors || 0,
    referrers: Object.entries(analytics.referrers || {}).map(([source, count]) => ({ source, count })),
    topPaths: Object.entries(analytics.paths || {}).map(([path, count]) => ({ path, count }))
  });
}));

app.post('/api/track', async (req, res) => {
  const { path, visitorId, referrer } = req.body;
  if (!path || typeof path !== 'string' || path.length > 200 || path.startsWith('/admin') || !path.startsWith('/')) {
    return res.json({ ok: true });
  }
  
  try {
    const { data: existing } = await supabase.from('site_settings').select('id, value').eq('key', 'analytics_data').maybeSingle();
    let analytics = existing?.value || { totalViews: 0, uniqueVisitors: 0, visitors: [], paths: {}, referrers: {} };
    
    // Global tracking
    analytics.totalViews = (analytics.totalViews || 0) + 1;
    analytics.paths[path] = (analytics.paths[path] || 0) + 1;
    
    // Unique visitor tracking (limit history to 2000 IDs to keep JSON small)
    if (visitorId && !analytics.visitors?.includes(visitorId)) {
      analytics.visitors = [...(analytics.visitors || []), visitorId].slice(-2000);
      analytics.uniqueVisitors = (analytics.uniqueVisitors || 0) + 1;
    }

    // Referrer tracking
    if (referrer && referrer !== 'direct') {
      try {
        const domain = new URL(referrer).hostname;
        analytics.referrers = analytics.referrers || {};
        analytics.referrers[domain] = (analytics.referrers[domain] || 0) + 1;
      } catch(e) {}
    }
    
    // Sort and limit paths and referrers
    const sortedPaths = Object.entries(analytics.paths).sort((a,b) => b[1]-a[1]).slice(0, 20);
    analytics.paths = Object.fromEntries(sortedPaths);
    
    if (analytics.referrers) {
      const sortedRefs = Object.entries(analytics.referrers).sort((a,b) => b[1]-a[1]).slice(0, 10);
      analytics.referrers = Object.fromEntries(sortedRefs);
    }
    
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
  // Hardcoded to strictly prevent Vercel ENV typos from sending to invalid addresses
  const adminEmail = 'hellocreatalab@gmail.com';
  
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

// reCAPTCHA verification utility
async function verifyRecaptcha(token) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    console.warn("RECAPTCHA_SECRET_KEY is not set. Skipping verification.");
    return true; // Bypass if not configured
  }
  if (!token) return false;
  
  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secret}&response=${token}`
    });
    const data = await res.json();
    return data.success;
  } catch (err) {
    console.error('reCAPTCHA verification error:', err);
    return false;
  }
}

app.post('/api/contact', emailLimiter, async (req, res) => {
  const { name, email, subject, message, recaptchaToken, website } = req.body;
  
  // 1. Honeypot check (website field should be empty)
  if (website) {
    console.warn('[SECURITY] Honeypot triggered by IP:', req.ip);
    return res.status(400).json({ error: 'System error. Please try again later.' });
  }

  // 2. Strict Input Validation & Sanitization
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const cleanName = (name || '').trim().substring(0, 100).replace(/<[^>]*>?/gm, '');
  const cleanEmail = (email || '').trim().toLowerCase().substring(0, 100);
  const cleanSubject = (subject || '').trim().substring(0, 200).replace(/<[^>]*>?/gm, '');
  const cleanMessage = (message || '').trim().substring(0, 5000).replace(/<[^>]*>?/gm, '');

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  // 3. Verify reCAPTCHA v3
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (secret) {
    try {
      const v3Res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${secret}&response=${recaptchaToken}`
      });
      const v3Data = await v3Res.json();
      
      // score based verification (e.g., < 0.5 is suspicious)
      if (!v3Data.success || v3Data.score < 0.5) {
        console.warn(`[SECURITY] Suspicious reCAPTCHA score: ${v3Data.score} for ${cleanEmail}`);
        return res.status(403).json({ error: 'Security check failed. Please refresh and try again.' });
      }
    } catch (err) {
      console.error('reCAPTCHA error:', err);
    }
  }

  // 4. Persistence
  const { data, error } = await supabase.from('contact_messages').insert({ 
    name: cleanName, 
    email: cleanEmail, 
    subject: cleanSubject, 
    message: cleanMessage, 
    created_at: new Date().toISOString() 
  });
  
  if (error) {
    console.error('[DB ERROR] Contact:', error);
    return res.status(500).json({ error: 'Failed to save message' });
  }
  
  // 5. Notify Admin (Async/No Wait to avoid timeout, but Resend is fast)
  sendNotificationEmail(
    `Secure Inquiry: ${cleanSubject}`,
    `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #6d28d9;">Secure Message Received</h2>
      <p><strong>From:</strong> ${cleanName} (&lt;${cleanEmail}&gt;)</p>
      <p><strong>Subject:</strong> ${cleanSubject}</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="white-space: pre-wrap;">${cleanMessage}</p>
      <p style="font-size: 10px; color: #aaa;">IP: ${req.ip} | reCAPTCHA verified</p>
    </div>`
  ).catch(console.error);

  res.json({ ok: true });
});

app.get('/api/contact', requireAdmin, asyncHandler(async (req, res) => {
  const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
  res.json(data || []);
}));

app.post('/api/bookings', emailLimiter, asyncHandler(async (req, res) => {
  const { name, email, phone, service, message, preferredDate, recaptchaToken } = req.body;

  // Verify reCAPTCHA
  const isValid = await verifyRecaptcha(recaptchaToken);
  if (!isValid) {
    return res.status(400).json({ error: 'Failed reCAPTCHA verification. Please try again.' });
  }

  const { data, error } = await supabase.from('bookings').insert({ 
    name, email, phone, service, message, preferred_date: preferredDate || null, created_at: new Date().toISOString() 
  });

  if (error) {
    console.error('[DB INSERT ERROR] Booking:', error);
    return res.status(500).json({ error: 'Failed to save booking' });
  }
  
  // Wait for email notification to complete so Vercel does not terminate the function early
  await sendNotificationEmail(
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

app.get('/api/admin/images', requireAdmin, asyncHandler(async (req, res) => {
  let publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    publicDir = path.join(process.cwd(), '..', 'public');
  }
  if (!fs.existsSync(publicDir)) {
    // fallback if running inside /api folder
    publicDir = path.join(__dirname, '..', 'public');
  }

  if (fs.existsSync(publicDir)) {
    const files = fs.readdirSync(publicDir);
    const validExts = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];
    const images = files.filter(f => {
      const ext = path.extname(f).toLowerCase();
      return validExts.includes(ext);
    });
    res.json(images.map(img => `/${img}`));
  } else {
    res.json([]);
  }
}));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } });

app.post('/api/admin/images/upload', requireAdmin, upload.single('image'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded' });
  }

  const bucketName = 'site-assets';

  // Make sure the bucket exists, ignore if it already does
  await supabase.storage.createBucket(bucketName, { public: true }).catch(() => {});

  const fileExt = req.file.originalname.split('.').pop() || 'png';
  const filePath = `${Date.now()}-${Math.round(Math.random() * 100000)}.${fileExt}`;

  const { error } = await supabase.storage.from(bucketName).upload(filePath, req.file.buffer, {
    contentType: req.file.mimetype,
    upsert: true,
  });

  if (error) {
    console.error('Supabase storage upload error:', error);
    return res.status(500).json({ error: 'Storage provider injection failed' });
  }

  const { data: pubData } = supabase.storage.from(bucketName).getPublicUrl(filePath);
  res.json({ url: pubData.publicUrl });
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
