
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';
let token = '';
let userId: number;
let productId: number;

async function login() {
    console.log("Logging in as user...");
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'cliente_fortaleza', password: 'senha789' })
    });
    const data = await res.json();
    if (res.ok) {
        token = data.token;
        userId = data.user.id;
        console.log("Logged in. Token:", token.substring(0, 10) + '...');
    } else {
        console.error("Login failed", data);
        process.exit(1);
    }
}

async function getProducts() {
    console.log("Fetching products...");
    const res = await fetch(`${BASE_URL}/products`);
    const data: any = await res.json();
    if (data.length > 0) {
        productId = data[0].id;
        console.log(`Found product: ${data[0].name} (ID: ${productId})`);
    } else {
        console.error("No products found. Seed db please.");
        process.exit(1);
    }
}

async function addToCart() {
    console.log("Adding to cart...");
    const res = await fetch(`${BASE_URL}/cart/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity: 2 })
    });
    const data = await res.json();
    console.log("Add Status:", res.status);
    console.log("Add Response:", data);
}

async function getCart() {
    console.log("Fetching cart...");
    const res = await fetch(`${BASE_URL}/cart`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data: any = await res.json();
    console.log("Cart:", JSON.stringify(data, null, 2));
    return data;
}

async function removeFromCart(cartItemId: number) {
    console.log(`Removing item ${cartItemId}...`);
    const res = await fetch(`${BASE_URL}/cart/${cartItemId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log("Delete Status:", res.status);
}

async function run() {
    await login();
    await getProducts();
    await addToCart();
    const cart = await getCart();
    if (cart.items && cart.items.length > 0) {
        await removeFromCart(cart.items[0].id);
        await getCart();
    }
}

run().catch(console.error);
