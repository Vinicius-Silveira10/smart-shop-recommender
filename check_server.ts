
import fetch from 'node-fetch';
// Wait for server to start, then check
const check = async () => {
    try {
        const res = await fetch('http://localhost:3000/');
        const data = await res.json();
        console.log('Server response:', data);
        if (data.message === 'Smart Recommender API is running!') {
            console.log('Verification SUCCEEDED');
            process.exit(0);
        } else {
            console.log('Verification FAILED: Unexpected response');
            process.exit(1);
        }
    } catch (e) {
        console.error('Verification FAILED: Connection error', e);
        process.exit(1);
    }
};

// Simple retry loop
let attempts = 0;
const interval = setInterval(() => {
    attempts++;
    check().then(() => clearInterval(interval)).catch(() => {
        if (attempts > 5) {
            console.error('Verification TIMED OUT');
            clearInterval(interval);
            process.exit(1);
        }
        console.log('Waiting for server...');
    });
}, 2000);
