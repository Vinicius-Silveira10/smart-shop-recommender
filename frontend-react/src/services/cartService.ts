import { apiClient, NODE_API_URL } from './BaseAPI';
import { AuthService } from './AuthService';

export const cartService = {
    /**
     * Recupera o carrinho do usuário logado.
     */
    getCart: async () => {
        const user = AuthService.getCurrentUser();
        // 🚀 O 'id' já vem como Number/String do nosso AuthService atualizado
        const userId = user?.id;

        if (!userId) {
            console.warn("⚠️ Tentativa de buscar carrinho sem usuário logado.");
            return { items: [] };
        }

        try {
            const res = await apiClient(NODE_API_URL, `/cart/${userId}`);
            return await res.json();
        } catch (error) {
            console.error("❌ Erro ao buscar carrinho:", error);
            return { items: [] };
        }
    },

    /**
     * Adiciona um produto ao carrinho.
     */
    addToCart: async (productId: number | string, quantity: number) => {
        const user = AuthService.getCurrentUser();
        const userId = user?.id;

        if (!userId) throw new Error("Usuário não autenticado");

        const response = await apiClient(NODE_API_URL, '/cart/add', {
            method: 'POST',
            body: JSON.stringify({
                // O backend receberá como Number e converterá para BigInt internamente
                userId: userId,
                productId: productId,
                quantity: Math.max(1, Number(quantity)) // Garante no mínimo 1 item
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erro ao adicionar ao carrinho");
        }

        return await response.json();
    },

    /**
     * Remove um item específico do carrinho (pelo ID do CartItem).
     */
    removeFromCart: async (cartItemId: number | string) => {
        const response = await apiClient(NODE_API_URL, `/cart/${cartItemId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error("Erro ao remover item do carrinho");
        return await response.json();
    },

    /**
     * Limpa todo o carrinho do usuário.
     */
    clearCart: async (userId: number | string) => {
        const response = await apiClient(NODE_API_URL, `/cart/clean/${userId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error("Erro ao limpar carrinho");
        return await response.json();
    }
};