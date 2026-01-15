// src/services/api.ts
import { Product, Recommendation, Interaction } from "@/types/product";

const BASE_URL = "https://3757fc9af6ab.ngrok-free.app";

const headers = {
"ngrok-skip-browser-warning": "true",
"Content-Type": "application/json",
};

export const api = {
async getRecommendations(userId: number): Promise<Recommendation> {
const response = await fetch(`${BASE_URL}/api/recommendations/${userId}`, {
headers,
});
if (!response.ok) {
throw new Error("Failed to fetch recommendations");
}
return response.json();
},

async getProductDetails(productId: number): Promise<Product> {
const response = await fetch(`${BASE_URL}/api/products/${productId}`, {
headers,
});
if (!response.ok) {
throw new Error("Failed to fetch product details");
}
return response.json();
},

async postInteraction(interaction: Interaction): Promise<void> {
const response = await fetch(`${BASE_URL}/api/interactions`, {
method: "POST",
headers,
body: JSON.stringify([interaction]),
});
if (!response.ok) {
throw new Error("Failed to post interaction");
}
},
};
