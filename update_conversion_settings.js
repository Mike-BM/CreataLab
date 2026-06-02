import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing Supabase environment variables.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const newPricing = {
  categories: [
    { title: 'Web Development', items: [
      { name: 'Starter Website', price: 'KES 5,000', details: 'Perfect for small businesses & personal portfolios' },
      { name: 'Business Velocity', price: 'KES 15,000', details: 'Full booking systems & custom business platforms' },
      { name: 'Enterprise Solution', price: 'Contact', details: 'Complex full-stack dashboards & custom logic' }
    ]},
    { title: 'Design & Branding', items: [
      { name: 'Bespoke Poster', price: 'KES 500', details: 'High-impact social media & event posters' },
      { name: 'Elite Logo Design', price: 'KES 3,000', details: 'Unique, professional brand identity kits' },
      { name: 'Full Identity Kit', price: 'KES 10,000', details: 'Total brand ecosystem + social guidelines' }
    ]}
  ]
};

async function forceUpdateSettings() {
  console.log("Updating site settings for maximum catchiness...");
  
  // Update Pricing
  const { error: pError } = await supabase.from('site_settings')
    .upsert({ key: 'pricing', value: newPricing }, { onConflict: 'key' });
  
  if (pError) console.error("Error updating pricing:", pError.message);
  else console.log("✓ Pricing updated with catchy names.");

  // Update Branding Tagline
  const { error: bError } = await supabase.from('site_settings')
    .upsert({ 
      key: 'branding', 
      value: { 
        name: 'CreataLab', 
        logoUrl: '/Logo.png', 
        tagline: 'Precision Web Design & Elite Branding for Growth' 
      } 
    }, { onConflict: 'key' });
    
  if (bError) console.error("Error updating branding:", bError.message);
  else console.log("✓ Branding updated successfully.");

  console.log("Catchy optimization complete.");
}

forceUpdateSettings();
