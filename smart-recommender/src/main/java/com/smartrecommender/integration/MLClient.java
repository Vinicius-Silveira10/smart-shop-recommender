package com.smartrecommender.integration;

import com.smartrecommender.dto.RecommendationDTO;
import com.smartrecommender.exception.IntegrationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;

@Slf4j // Habilita o uso do objeto 'log' para mensagens de erro profissionais
@Component
public class MLClient {

    private final RestTemplate restTemplate;

    // Injeta a URL configurada no application.properties (http://localhost:8000)
    @Value("${ml.service.url}")
    private String mlServiceUrl;

    public MLClient() {
        this.restTemplate = new RestTemplate();
    }

    /**
     * Busca as recomendações do motor de IA (Python).
     * Se o serviço estiver offline, retorna uma lista vazia para evitar o Erro 503
     * no Frontend.
     */
    public RecommendationDTO fetchRecommendations(Long userId, int k) {
        String url = String.format("%s/recommendations/%d?k=%d", mlServiceUrl, userId, k);

        try {
            log.info("Tentando obter recomendações para o usuário {} na URL: {}", userId, url);
            return restTemplate.getForObject(url, RecommendationDTO.class);
        } catch (RestClientException e) {
            // LOG PROFISSIONAL: Substituímos o System.err pelo log.warn
            log.warn("Motor de IA (Porta 8000) está offline ou inacessível. Retornando fallback vazio. Erro: {}",
                    e.getMessage());

            // FALLBACK: Cria um objeto de recomendação vazio para o Frontend não quebrar
            // Certifique-se de que o construtor do seu RecommendationDTO aceite (String,
            // List)
            return new RecommendationDTO("offline-mode-fallback", Collections.emptyList());
        } catch (Exception e) {
            log.error("Erro inesperado ao falar com o serviço de ML: {}", e.getMessage());
            return new RecommendationDTO("error-fallback", Collections.emptyList());
        }
    }

    /**
     * Dispara o treinamento do modelo.
     */
    public void triggerModelTraining() {
        String url = String.format("%s/admin/retrain", mlServiceUrl);
        try {
            log.info("Disparando re-treinamento do modelo na URL: {}", url);
            restTemplate.postForObject(url, null, String.class);
        } catch (RestClientException e) {
            log.error("Falha ao disparar o treinamento do modelo: {}", e.getMessage());
            // Aqui não lançamos Exception para não travar o fluxo principal
        }
    }
}