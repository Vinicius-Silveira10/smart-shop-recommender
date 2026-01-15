package com.smartrecommender.service;

import com.smartrecommender.dto.RecommendationDTO;
import com.smartrecommender.dto.RecommendedItem;
import com.smartrecommender.integration.MLClient;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class RecommendationServiceTest {

    @Mock
    private MLClient mlClient;

    @InjectMocks
    private RecommendationService recommendationService;

    @Test
    @DisplayName("Deve chamar o MLClient e retornar as recomendações com sucesso")
    void getRecommendations_WhenCalled_ShouldReturnRecommendationDTO() {
        // Given (Dado)
        long userId = 1L;
        int k = 5;
        RecommendationDTO mockResponse = new RecommendationDTO(
                "v1.2.3",
                List.of(new RecommendedItem(101L, 0.98), new RecommendedItem(102L, 0.95))
        );

        given(mlClient.fetchRecommendations(userId, k)).willReturn(mockResponse);

        // When (Quando)
        RecommendationDTO result = recommendationService.getRecommendations(userId, k);

        // Then (Então)
        assertThat(result).isNotNull();
        assertThat(result.modelVersion()).isEqualTo("v1.2.3");
        assertThat(result.recommendations()).hasSize(2);

        verify(mlClient).fetchRecommendations(userId, k);
    }
}