import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const publicDir = path.join(process.cwd(), 'public');

// Images available in public directory
const imageFiles = [
    '7.png',
    'Carlos 3.jpeg',
    'Carlos 4.jpeg',
    'Embu Ticket 1.png',
    'Embu Ticket 2.png',
    'Embu.png',
    'Large Poster.png',
    'Marine Regular.png',
    'Marine VIP.png',
    "Mbooni Children's Home.png",
    'My firm1.jpg',
    'Shift Monday 1.png',
    'Shift Quest valentine.png',
    'Shift1.png',
    'Shift2.png',
    'ShiftQuest 1.png',
    'WhatsApp Image 2025-12-18 at 7.00.09 PM.png',
    'WhatsApp Image 2025-12-18 at 7.00.54 PM.png',
    'WhatsApp Image 2026-02-19 at 1.35.43 PM.jpeg',
    'f9d0b3b3b1b6a8e7b2d359d14d1873cb.png',
    'unnamed (1).jpg'
];

function generateProjectData(filename) {
    // Try to make a nice title
    const title = filename.replace(/\.(png|jpe?g)$/i, '').replace(/[-_]/g, ' ');

    // Assign random category from valid categories
    const categories = ["Branding", "Digital", "Data", "Web"];
    const category = categories[Math.floor(Math.random() * categories.length)];

    return {
        title: title,
        category: category,
        image_url: `/${filename}`,
        description: `A creative project exploring ${category.toLowerCase()} solutions for ${title}.`,
        full_description: `This is a comprehensive overview of the ${title} project, highlighting our approach to ${category.toLowerCase()} design and implementation.`,
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
}

async function seed() {
    console.log('Starting to seed projects...');

    const projects = [];

    for (const file of imageFiles) {
        // Only add if the file exists
        if (fs.existsSync(path.join(publicDir, file))) {
            projects.push(generateProjectData(file));
        }
    }

    if (projects.length === 0) {
        console.log('No images found to insert.');
        return;
    }

    const { data, error } = await supabase
        .from('projects')
        .insert(projects)
        .select();

    if (error) {
        console.error('Error seeding projects:', error);
    } else {
        console.log(`Successfully seeded ${data.length} projects!`);
    }
}

seed();
