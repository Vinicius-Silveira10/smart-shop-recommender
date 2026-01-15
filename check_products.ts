
import fetch from 'node-fetch';

const checkProducts = async () => {
    try {
        console.log("1. Testing Public GET /products...");
        const resGet = await fetch('http://localhost:3000/products');
        const products = await resGet.json();
        console.log('GET /products response status:', resGet.status);
        console.log('Products count:', Array.isArray(products) ? products.length : 'Not an array');

        console.log("\n2. Login as Admin...");
        const resLogin = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'vinicius', password: '123456' })
        });
        const loginData = await resLogin.json();
        const token = loginData.token;
        console.log('Login success:', !!token);

        console.log("\n3. Testing Protected POST /products (Admin)...");
        const resPost = await fetch('http://localhost:3000/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: 'Test Product',
                description: 'A product for testing',
                price: 99.99,
                category: 'Testing',
                brand: 'TestBrand',
                stockQuantity: 10
            })
        });
        const createdProduct = await resPost.json();
        console.log('POST /products response status:', resPost.status);
        console.log('Created Product:', createdProduct);

        if (resGet.status === 200 && resPost.status === 201 && createdProduct.id) {
            console.log('\nVerification SUCCEEDED');
            process.exit(0);
        } else {
            console.log('\nVerification FAILED');
            process.exit(1);
        }

    } catch (e) {
        console.error('Verification FAILED: Connection error', e);
        process.exit(1);
    }
};

setTimeout(checkProducts, 2000);
