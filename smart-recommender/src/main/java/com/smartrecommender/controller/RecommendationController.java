package com.smartrecommender.controller;

import com.smartrecommender.dto.RecommendationDTO;
import com.smartrecommender.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController // Marca a classe como um controlador REST
@RequestMapping("/api/recommendations") // Mapeia todas as requisições para este endpoint base
@RequiredArgsConstructor // Cria um construtor para injetar as dependências final
public class RecommendationController {

    // Injeta a dependência da camada de serviço
    private final RecommendationService recommendationService;

    /**
     * Endpoint para buscar recomendações para um usuário específico.
     * Exemplo de chamada: GET http://localhost:8080/api/recommendations/1?k=5
     *
     * @param userId O ID do usuário.
     * @param k      O número de recomendações a serem retornadas (opcional, padrão é 5).
     * @return Uma resposta HTTP com o DTO de recomendações.
     */
    @GetMapping("/{userId}")
    public ResponseEntity<RecommendationDTO> getRecommendations(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "5") int k) {

        // Delega a lógica de negócio para a camada de serviço
        RecommendationDTO recommendations = recommendationService.getRecommendations(userId, k);

        // Retorna a resposta com status 200 (OK) e o corpo contendo as recomendações
        return ResponseEntity.ok(recommendations);
    }
}