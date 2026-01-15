
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function test() {
    try {
        console.log("=== STARTING API VERIFICATION ===");

        // 1. AUTH: Register
        const randomUser = `user_${Math.floor(Math.random() * 10000)}`;
        console.log(`\n1. Registering new user: ${randomUser}`);
        const regRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: randomUser, password: 'password123' })
        });
        const regData = await regRes.json();
        console.log(`Status: ${regRes.status}`, regData.username === randomUser ? '✅' : '❌');

        // 2. AUTH: Login (as new user)
        console.log(`\n2. Logging in as ${randomUser}`);
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: randomUser, password: 'password123' })
        });
        const loginData = await loginRes.json();
        const userToken = loginData.token;
        console.log(`Status: ${loginRes.status}`, userToken ? '✅' : '❌');

        // 3. AUTH: Login (as Admin)
        console.log(`\n3. Logging in as Admin (vinicius)`);
        const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'vinicius', password: '123456' })
        });
        const adminData = await adminLoginRes.json();
        const adminToken = adminData.token;
        console.log(`Status: ${adminLoginRes.status}`, adminToken ? '✅' : '❌');

        // 4. PRODUCTS: Create (Admin)
        console.log(`\n4. Creating Product (Admin)`);
        const prodRes = await fetch(`${BASE_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({
                name: 'API Test Product',
                description: 'Created by script',
                price: 50.00,
                category: 'Test',
                brand: 'ScriptBrand',
                stockQuantity: 100
            })
        });
        const prodData = await prodRes.json();
        const prodId = prodData.id;
        console.log(`Status: ${prodRes.status}`, prodId ? '✅' : '❌');

        // 5. PRODUCTS: Get By ID
        console.log(`\n5. Get Product By ID: ${prodId}`);
        const getRes = await fetch(`${BASE_URL}/products/${prodId}`);
        const getData = await getRes.json();
        console.log(`Status: ${getRes.status}`, getData.name === 'API Test Product' ? '✅' : '❌');

        // 6. PRODUCTS: Update (Admin)
        console.log(`\n6. Updating Product: ${prodId}`);
        const updateRes = await fetch(`${BASE_URL}/products/${prodId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({ price: 75.00 })
        });
        const updateData = await updateRes.json();
        console.log(`Status: ${updateRes.status}`, updateData.price === 75 ? '✅' : '❌');

        // 7. PRODUCTS: Delete (Admin)
        console.log(`\n7. Deleting Product: ${prodId}`);
        const delRes = await fetch(`${BASE_URL}/products/${prodId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        console.log(`Status: ${delRes.status}`, delRes.status === 204 ? '✅' : '❌');

        // 8. PRODUCTS: Verify Delete
        console.log(`\n8. Verifying Delete`);
        const checkRes = await fetch(`${BASE_URL}/products/${prodId}`);
        console.log(`Status: ${checkRes.status}`, checkRes.status === 404 ? '✅' : '❌');

        console.log("\n=== VERIFICATION COMPLETE ===");
        if (regRes.status === 201 && loginRes.status === 200 && prodRes.status === 201 && updateRes.status === 200 && delRes.status === 204 && checkRes.status === 404) {
            console.log("ALL TESTS PASSED");
            process.exit(0);
        } else {
            console.log("SOME TESTS FAILED");
            process.exit(1);
        }

    } catch (e) {
        console.error("Verification Error:", e);
        process.exit(1);
    }
}

setTimeout(test, 1000);
