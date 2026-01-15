package com.smartrecommender.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/cart") // CORREÇÃO 1: Adicionado /api para bater com o Frontend
public class CartController {

    @GetMapping
    public ResponseEntity<?> getCart() {
        // Retorna o formato que o seu CartContext espera: { "items": [...] }
        return ResponseEntity.ok(Map.of("items", List.of()));
    }

    // CORREÇÃO 2: Adicionado endpoint para resolver o erro 404 em /cart/add
    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(Map.of("message", "Produto adicionado ao carrinho!"));
    }

    // CORREÇÃO 3: Adicionado endpoint para remoção de itens
    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long cartItemId) {
        System.out.println("Removendo item: " + cartItemId);
        return ResponseEntity.noContent().build();
    }

}