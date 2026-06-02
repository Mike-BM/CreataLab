import jwt from 'jsonwebtoken';

const API_BASE = 'http://localhost:4000/api';
const JWT_SECRET = 'creatalab-super-secret-jwt-key-2024';

const token = jwt.sign({ id: 'test-admin', email: 'admin@creatalab.com' }, JWT_SECRET);

async function runTests() {
    console.log('--- Verification Started ---');

    console.log('Testing Health...');
    try {
        const res = await fetch(`${API_BASE}/health`);
        const data = await res.json();
        console.log(`Health Check: ${res.ok ? 'PASS' : 'FAIL'} (${JSON.stringify(data)})`);
    } catch (e) { console.log(`Health Check: ERROR (${e.message})`); }

    console.log('Testing Contact Ingestion...');
    try {
        const res = await fetch(`${API_BASE}/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Test User', email: 'test@example.com', subject: 'Test', message: 'Hello' })
        });
        const data = await res.json().catch(() => ({}));
        console.log(`Contact Ingestion: ${res.ok ? 'PASS' : 'FAIL'} (${JSON.stringify(data)})`);
    } catch (e) { console.log(`Contact Ingestion: ERROR (${e.message})`); }

    console.log('Testing Stats...');
    try {
        const res = await fetch(`${API_BASE}/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        console.log(`Stats Endpoint: ${res.ok ? 'PASS' : 'FAIL'} (${JSON.stringify(data)})`);
    } catch (e) { console.log(`Stats Endpoint: ERROR (${e.message})`); }

    console.log('Testing Users...');
    try {
        const res = await fetch(`${API_BASE}/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        console.log(`Users Endpoint: ${res.ok ? 'PASS' : 'FAIL'} (Found ${Array.isArray(data) ? data.length : 'error'} users)`);
    } catch (e) { console.log(`Users Endpoint: ERROR (${e.message})`); }

    console.log('--- Verification Finished ---');
    process.exit(0);
}

runTests();
