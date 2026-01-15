package com.smartrecommender.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PurchaseHistoryDTO(
        Long interactionId,
        Long productId,
        String productName,
        String category,
        BigDecimal price,
        String imageUrl,
        LocalDateTime timestamp
) {}