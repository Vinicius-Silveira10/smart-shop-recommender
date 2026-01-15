
import fetch from 'node-fetch';

async function register() {
    console.log("Registering 'cliente_fortaleza'...");
    try {
        const res = await fetch('http://localhost:3000/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'cliente_fortaleza', password: 'senha789' })
        });
        const data = await res.json();
        console.log('Status:', res.status);
        console.log('Response:', data);
    } catch (e) {
        console.error(e);
    }
}
register();
