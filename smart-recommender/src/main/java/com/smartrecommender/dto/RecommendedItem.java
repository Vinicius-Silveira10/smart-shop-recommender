package com.smartrecommender.dto;

public record RecommendedItem(
        Long productId,
        double score
) {}