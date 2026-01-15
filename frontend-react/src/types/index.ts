// 📦 Define como é um Produto (Sincronizado com BigInt do Prisma)
export interface Product {
    // 🚀 CORREÇÃO: IDs vindos de BigInt chegam como string ou number no JS
    id: number | string;
    name: string;
    description: string;
    category: string;
    subcategory: string;
    brand: string;
    gender: string;
    price: number;
    // CORREÇÃO: Aceita null para campos vazios do banco
    imageUrl: string | null;
    stockQuantity: number;
    status?: string;
}

// 🤖 Define a resposta da Recomendação
export interface RecommendationResponse {
    modelVersion: string;
    // O Java pode retornar 'results' ou 'recommendations' dependendo da versão
    recommendations: {
        productId: number | string; // 🚀 BigInt compatível
        score: number;
        product?: Product;
    }[];
}

// 📡 Define a Interação enviada para o Java (Porta 8083)
export interface InteractionRequest {
    userId: number | string;    // 🚀 BigInt compatível
    productId: number | string; // 🚀 BigInt compatível
    actionType: 'view' | 'click' | 'add_to_cart' | 'purchase';
    timestamp: string;
}

// 👤 Modelo de Usuário
export interface User {
    id: number | string; // 🚀 BigInt compatível
    username: string;
    role?: 'USER' | 'ADMIN';
}