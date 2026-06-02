import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function addProject() {
    console.log('Adding AI Soil Tracker project...');

    const project = {
        title: 'AI Soil Tracker',
        category: 'AI Solutions',
        image_url: 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?q=80&w=1000&auto=format&fit=crop',
        description: 'AI-powered soil health monitoring and predictive analytics for sustainable agriculture.',
        full_description: 'An intelligent platform that uses machine learning to analyze soil data in real-time, providing farmers with actionable insights on moisture levels, nutrient deficiencies, and optimal planting windows. Built with scalability and precision in mind.',
        client: 'AgriTech Innovation',
        tools: ['TensorFlow', 'React', 'Supabase', 'IoT Sensors'],
        features: ['Real-time Monitoring', 'Predictive Yield Analytics', 'Automated Irrigation Alerts', 'Soil PH Mapping'],
        link: 'https://ai-soil-tracker.lovable.app/',
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
        .from('projects')
        .insert([project])
        .select();

    if (error) {
        console.error('Error adding project:', error);
    } else {
        console.log(`Successfully added project with ID: ${data[0].id}`);
    }
}

addProject();
