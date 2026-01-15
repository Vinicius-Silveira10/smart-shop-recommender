package com.smartrecommender.service;

import com.smartrecommender.dto.RecommendationDTO;
import com.smartrecommender.integration.MLClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final MLClient mlClient;

    /**
     * Orquestra a busca por recomendações chamando o cliente de integração.
     * @param userId O ID do usuário.
     * @param k O número de itens a serem recomendados.
     * @return Um DTO contendo as recomendações.
     */
    public RecommendationDTO getRecommendations(Long userId, int k) {
        // A lógica principal é delegada ao MLClient
        return mlClient.fetchRecommendations(userId, k);
    }
}