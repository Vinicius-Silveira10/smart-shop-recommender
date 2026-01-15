
import fetch from 'node-fetch';

const checkLogin = async () => {
    try {
        console.log("Attempting login...");
        const res = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'vinicius', password: '123456' })
        });

        const data = await res.json();
        console.log('Login response:', data);

        if (res.status === 200 && data.token && data.user && data.user.username === 'vinicius') {
            console.log('Login Verification SUCCEEDED');
            process.exit(0);
        } else {
            console.log('Login Verification FAILED: Invalid response', res.status);
            process.exit(1);
        }
    } catch (e) {
        console.error('Login Verification FAILED: Connection error', e);
        process.exit(1);
    }
};

// Wait a bit for server to start if just launched
setTimeout(checkLogin, 3000);
