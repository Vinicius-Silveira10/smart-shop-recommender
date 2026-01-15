import { apiClient, JAVA_API_URL } from './BaseAPI';
import type { Product } from '../types';

export const ProductService = {
    // 🚀 Busca todos os produtos (Java - 8083)
    getAll: async (): Promise<Product[]> => {
        const response = await apiClient(JAVA_API_URL, '/api/products');
        return response.json();
    },

    // 🔍 Busca por ID (Long)
    getById: async (id: string | number): Promise<Product> => {
        const response = await apiClient(JAVA_API_URL, `/api/products/${id}`);
        return response.json();
    },

    // 🔎 Pesquisa por texto (Nome do produto)
    search: async (query: string): Promise<Product[]> => {
        const response = await apiClient(JAVA_API_URL, `/api/products/search?q=${query}`);
        return response.json();
    },

    /**
     * 🛒 FINALIZAÇÃO DE COMPRA (Checkout)
     * Envia os IDs do carrinho para criar um registro na tabela 'orders' e 'order_items'.
     */
    checkout: async (userId: string | number, productIds: number[]) => {
        return await apiClient(JAVA_API_URL, `/api/products/checkout/${Number(userId)}`, {
            method: 'POST',
            body: JSON.stringify(productIds)
        });
    },

    /**
     * 📂 HISTÓRICO DE PEDIDOS
     * Retorna a lista de pedidos reais para o modal do perfil.
     */
    getUserOrders: async (userId: string | number) => {
        const response = await apiClient(JAVA_API_URL, `/api/products/orders/${Number(userId)}`);
        return response.json();
    },

    /**
     * 📊 REGISTRO DE INTERAÇÕES (IA)
     * Garante que cliques e visualizações sejam salvos como números (Long).
     */
    trackInteraction: async (userId: string | number, productId: string | number, actionType: string) => {
        try {
            const payload = {
                userId: Number(userId),
                productId: Number(productId),
                actionType: actionType,
                timestamp: new Date().toISOString()
            };

            return await apiClient(JAVA_API_URL, '/api/interactions', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
        } catch (error) {
            console.error("❌ Erro no envio da interação:", error);
        }
    },

    // 🎯 Filtro avançado
    getFiltered: async (filters: any): Promise<Product[]> => {
        const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
        );

        const params = new URLSearchParams(cleanFilters as any).toString();
        const response = await apiClient(JAVA_API_URL, `/api/products/filter?${params}`);
        return response.json();
    },

    // 💾 Gerenciamento de Produtos (Dashboard Lojista)
    save: async (productData: Partial<Product>) => {
        const method = productData.id ? 'PUT' : 'POST';
        const url = productData.id ? `/api/products/${productData.id}` : '/api/products';

        return apiClient(JAVA_API_URL, url, {
            method: method,
            body: JSON.stringify(productData)
        });
    }
};