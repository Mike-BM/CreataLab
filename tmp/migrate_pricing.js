import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const newPricing = { categories: [
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
] };

async function migrate() {
  const { error } = await supabase.from('site_settings').update({ value: newPricing }).eq('key', 'pricing');
  if (error) {
    console.error('Migration error:', error);
  } else {
    console.log('Prices updated successfully in Database.');
  }
}

migrate();
