package com.smartrecommender.service;

import com.smartrecommender.dto.InteractionDTO;
import com.smartrecommender.dto.PurchaseHistoryDTO;
import com.smartrecommender.model.Interaction;
import com.smartrecommender.model.Product;
import com.smartrecommender.repository.InteractionRepository;
import com.smartrecommender.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j; // 🚀 FIX: Resolve o erro 'cannot find symbol variable log'
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j // 🚀 FIX: Habilita o processamento de logs via Lombok
public class InteractionService {

    private final InteractionRepository interactionRepository;
    private final ProductRepository productRepository;

    @Transactional
    public void saveInteraction(InteractionDTO interactionDTO) {
        log.info("Registrando interação do tipo: {} para usuário: {}", interactionDTO.actionType(),
                interactionDTO.userId());
        interactionRepository.save(toEntity(interactionDTO));
    }

    @Transactional
    public void saveInteractions(List<InteractionDTO> interactionDTOs) {
        if (interactionDTOs == null || interactionDTOs.isEmpty())
            return;

        List<Interaction> interactions = interactionDTOs.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
        interactionRepository.saveAll(interactions);
        log.info("{} interações salvas em lote.", interactions.size());
    }

    /**
     * Busca o histórico de compras para alimentar o perfil do usuário.
     */
    public List<PurchaseHistoryDTO> getPurchasesByUser(Long userId) {
        List<Interaction> purchases = interactionRepository.findByUserIdAndActionTypeOrderByTimestampDesc(userId,
                "purchase");

        return purchases.stream().map(interaction -> {
            // Busca o produto real para obter nome, categoria e preço atual
            Product product = productRepository.findById(interaction.getProductId()).orElse(null);

            // 🚀 FIX: Utiliza os getters gerados pelo @Data na Entity Interaction
            return new PurchaseHistoryDTO(
                    interaction.getId(),
                    interaction.getProductId(),
                    product != null ? product.getName() : "Produto Indisponível",
                    product != null ? product.getCategory() : "N/A",
                    product != null ? product.getPrice() : BigDecimal.ZERO,
                    product != null ? product.getImageUrl() : null,
                    interaction.getTimestamp());
        }).collect(Collectors.toList());
    }

    private Interaction toEntity(InteractionDTO dto) {
        Interaction interaction = new Interaction();
        // 🚀 FIX: Usa os métodos de acesso do Record InteractionDTO (dto.userId())
        // e os setters da Entity Interaction (setUserId)
        interaction.setUserId(dto.userId());
        interaction.setProductId(dto.productId());
        interaction.setActionType(dto.actionType());
        interaction.setTimestamp(dto.timestamp());
        return interaction;
    }

    private InteractionDTO toDTO(Interaction interaction) {
        return new InteractionDTO(
                interaction.getUserId(),
                interaction.getProductId(),
                interaction.getActionType(),
                interaction.getTimestamp());
    }
}