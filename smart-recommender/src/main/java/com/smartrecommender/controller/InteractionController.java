package com.smartrecommender.controller;

import com.smartrecommender.dto.InteractionDTO;
import com.smartrecommender.dto.PurchaseHistoryDTO; // Importe o novo DTO
import com.smartrecommender.service.InteractionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interactions")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class InteractionController {

    private final InteractionService interactionService;

    /**
     * Busca o histórico de compras de um usuário específico.
     * Alterado de List<Interaction> para List<PurchaseHistoryDTO> para incluir
     * detalhes do produto.
     */
    @GetMapping("/user/{userId}/purchases")
    public ResponseEntity<List<PurchaseHistoryDTO>> getUserPurchases(@PathVariable Long userId) {
        // O serviço agora deve retornar a lista de DTOs mapeados com nomes e preços
        return ResponseEntity.ok(interactionService.getPurchasesByUser(userId));
    }

    /**
     * Registra interações (cliques, visualizações ou compras) em lote.
     */
    @PostMapping
    public ResponseEntity<Void> recordInteractions(@RequestBody @Valid List<InteractionDTO> interactions) {
        interactionService.saveInteractions(interactions);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}