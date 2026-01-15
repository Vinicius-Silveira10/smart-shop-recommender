// src/services/IAService.ts
import { apiClient, JAVA_API_URL } from './BaseAPI';

export class IAService {
    /**
     * Busca recomendações do Java (Porta 8083).
     * Resolve o erro 503 ao apontar para a porta correta.
     */
    static async getRecommendations(userId: number | string) {
        try {
            const res = await apiClient(JAVA_API_URL, `/api/recommendations/${userId}`);

            if (!res.ok) return { results: [] };

            const data = await res.json();

            // Mapeia 'recommendations' (campo do RecommendationDTO.java) para 'results' (usado no Dashboard)
            return {
                results: data.recommendations || []
            };
        } catch (error) {
            console.error("Falha na rede ao buscar recomendações:", error);
            return { results: [] };
        }
    }

    /**
     * Registra interações no Java (Porta 8083).
     * Envia como Array [] para satisfazer a List<InteractionDTO> do Controller.
     */
    static async logInteraction(userId: number, productId: number, type: string) {
        const payload = [{
            userId: userId,
            productId: productId,
            actionType: type, // Sincronizado com o campo actionType do DTO Java
            timestamp: new Date().toISOString() // Formato aceito pelo @JsonFormat no Java
        }];

        return apiClient(JAVA_API_URL, '/api/interactions', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    }
}

export const iaService = IAService;