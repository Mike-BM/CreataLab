
const API_BASE = 'http://localhost:4000/api';

async function testLogin() {
    const credentials = [
        { email: 'admin@creatalab.com', password: 'CreataLabAdmin!2026' },
        { email: 'brianmuema928@gmail.com', password: 'CreataLabAdmin!2026' },
        { email: 'ADMIN@CREATALAB.COM', password: 'CreataLabAdmin!2026' }, // Test casing
        { email: 'nonexistent@example.com', password: 'password' }
    ];

    for (const cred of credentials) {
        console.log(`\nTesting login for: ${cred.email}`);
        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cred)
            });
            const data = await res.json();
            console.log(`Status: ${res.status}`);
            console.log(`Response: ${JSON.stringify(data)}`);
        } catch (e) {
            console.log(`Error: ${e.message}`);
        }
    }
    process.exit(0);
}

testLogin();
