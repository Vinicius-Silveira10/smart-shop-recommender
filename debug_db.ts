
import 'dotenv/config';
const url = process.env.DATABASE_URL;

if (!url) {
    console.log("DATABASE_URL is not set");
} else {
    try {
        // Handle postgres:// or postgresql://
        // Note: verify if it starts with valid protocol
        console.log(`Original URL (masked): ${url.replace(/:[^:@]*@/, ':****@')}`);

        // Manual parsing if URL fails (sometimes specific chars break it)
        const match = url.match(/^(postgresql|postgres):\/\/(.*?):(.*?)@(.*?):(\d+)\/(.*)$/);

        if (match) {
            console.log(`Protocol: ${match[1]}`);
            console.log(`User: ${match[2]}`);
            console.log(`Password: ****`);
            console.log(`Host: ${match[4]}`);
            console.log(`Port: ${match[5]}`);
            console.log(`Database: ${match[6]}`);
        } else {
            console.log("Could not parse URL with regex. Trying URL object...");
            const u = new URL(url);
            console.log(`Protocol: ${u.protocol}`);
            console.log(`Hostname: ${u.hostname}`);
            console.log(`Port: ${u.port}`);
            console.log(`Database: ${u.pathname}`);
        }
    } catch (e) {
        console.log("Error parsing URL:", e);
    }
}
