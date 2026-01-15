import { apiClient, JAVA_API_URL } from './BaseAPI';

export class OrderService {
    /**
     * Realiza o checkout no microsserviço Java (8083).
     * MUDANÇA: Voltamos para snake_case no payload para bater com o @JsonProperty do Java.
     */
    static async checkout(userId: number, cartItems: any[], totalProducts: number, cep: string, shippingFee: number) {
        const payload = {
            user_id: userId, // Sincronizado com @JsonProperty("user_id")
            total_amount: totalProducts + shippingFee, // Sincronizado com @JsonProperty("total_amount")
            shipping_fee: shippingFee,
            cep: cep.replace(/\D/g, ""),
            items: cartItems.map(item => ({
                productId: item.productId || item.product.id,
                quantity: item.quantity || 1,
                priceAtPurchase: item.product.price
            }))
        };

        // O BaseAPI já adiciona o prefixo /api automaticamente
        const response = await apiClient(JAVA_API_URL, '/orders/checkout', {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Falha no checkout.");
        return await response.json();
    }

    /**
     * Busca o histórico de compras do usuário.
     */
    static async getUserPurchases(userId: number) {
        // A URL final será http://localhost:8083/api/orders/user/{id}
        const res = await apiClient(JAVA_API_URL, `/orders/user/${userId}`);

        if (res.ok) {
            const data = await res.json();
            /**
             * O Java/Spring pode retornar os dados dentro de um objeto 'content' se usar Pageable.
             */
            return Array.isArray(data) ? data : (data.content || []);
        }
        return [];
    }
}