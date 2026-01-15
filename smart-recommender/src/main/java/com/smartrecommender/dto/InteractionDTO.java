package com.smartrecommender.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record InteractionDTO(
        @NotNull Long userId,
        @NotNull Long productId,
        @NotEmpty String actionType,

        // 🚀 MELHORIA: Shape.STRING aceita variações de milissegundos do toISOString()
        @JsonFormat(shape = JsonFormat.Shape.STRING) LocalDateTime timestamp) {
}
