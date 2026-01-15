package com.smartrecommender.dto;

import java.util.List;

// Usando 'record' para um DTO imutável e conciso
public record RecommendationDTO(
        String modelVersion,
        List<RecommendedItem> recommendations
) {}