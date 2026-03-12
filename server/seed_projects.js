// Seed Supabase with default portfolio items
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE env vars in server/.env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const defaultProjects = [
  {
    title: "Brand Evolution",
    category: "Branding",
    image_url: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Complete brand overhaul including identity, digital presence, and marketing collateral.",
    full_description: "We evolved the brand identity to match their new strategic direction, focusing on modern aesthetics and digital-first applications.",
    client: "TechFlow Inc.",
    tools: ["Figma", "Illustrator", "React"],
    features: ["Logo Design", "Brand Guidelines", "Website Redesign"],
    published: true
  },
  {
    title: "E-Commerce Platform",
    category: "Web",
    image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Next-generation shopping experience with seamless checkout and personalized recommendations.",
    full_description: "A headless commerce solution providing lightning-fast performance and exceptional user experience across all devices.",
    client: "ShopNow",
    tools: ["Next.js", "Shopify", "Tailwind CSS"],
    features: ["Headless CMS", "Real-time Inventory", "AI Recommendations"],
    published: true
  },
  {
    title: "Data Visualization Dashboard",
    category: "Data",
    image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Interactive analytics dashboard translating complex data into actionable insights.",
    full_description: "Built a custom dashboard that aggregates data from 5 different sources, providing real-time insights for executive decision making.",
    client: "DataCorp",
    tools: ["D3.js", "React", "Node.js"],
    features: ["Real-time Updates", "Custom Charts", "Export Capabilities"],
    published: true
  },
  {
    title: "Digital Marketing Campaign",
    category: "Digital",
    image_url: "https://images.unsplash.com/photo-1533750516457-a7f992034fec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Multi-channel digital campaign that increased engagement by 300%.",
    full_description: "A comprehensive digital marketing strategy encompassing social media, email marketing, and targeted advertising.",
    client: "GrowthTech",
    tools: ["HubSpot", "Google Analytics", "Mailchimp"],
    features: ["A/B Testing", "Automated Workflows", "Performance Tracking"],
    published: true
  }
];

async function seed() {
  console.log('Seeding projects table...');
  const now = new Date().toISOString();
  
  for (const proj of defaultProjects) {
    const { error } = await supabase.from('projects').insert({
      ...proj,
      created_at: now,
      updated_at: now
    });
    
    if (error) {
      console.error(`Error inserting ${proj.title}:`, error.message);
    } else {
      console.log(`Inserted: ${proj.title}`);
    }
  }
  
  console.log('Done!');
}

seed();
