const API_BASE = 'http://localhost:4000/api';

async function testLogin() {
    const PASS = process.env.ADMIN_DEFAULT_PASSWORD;
    if (!PASS) {
        console.error('FATAL: ADMIN_DEFAULT_PASSWORD is required in .env for this test');
        process.exit(1);
    }

    const credentials = [
        { email: 'admin@creatalab.com', password: PASS },
        { email: 'brianmuema928@gmail.com', password: PASS },
        { email: 'ADMIN@CREATALAB.COM', password: PASS }, // Test casing
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
