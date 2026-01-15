package com.smartrecommender.controller;

import com.smartrecommender.dto.ProductDTO;
import com.smartrecommender.model.Order; // 🚀 IMPORTANTE: Importando a nova classe Order
import com.smartrecommender.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductDTO>> search(@RequestParam("q") String query) {
        return ResponseEntity.ok(productService.searchProducts(query));
    }

    /**
     * 🛒 PROCESSA A FINALIZAÇÃO DA COMPRA
     */
    @PostMapping("/checkout/{userId}")
    public ResponseEntity<Void> checkout(@PathVariable Long userId, @RequestBody List<Long> productIds) {
        log.info("#### PROCESSANDO CHECKOUT ####");
        log.info("Usuário ID: {} finalizando compra de {} itens.", userId, productIds.size());

        productService.savePurchase(userId, productIds);

        log.info("Checkout concluído com sucesso para o usuário {}.", userId);
        return ResponseEntity.ok().build();
    }

    /**
     * 📂 BUSCA HISTÓRICO DE PEDIDOS
     * 🚀 CORREÇÃO: Alterado de List<ProductDTO> para List<Order> para bater com o
     * Service.
     */
    @GetMapping("/orders/{userId}")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable Long userId) {
        log.info("#### SOLICITAÇÃO DE HISTÓRICO ####");
        log.info("Usuário ID: {} consultando seus pedidos realizados.", userId);

        // O Service agora retorna List<Order> contendo os OrderItems dentro
        List<Order> orders = productService.getUserOrders(userId);

        log.info("Total de pedidos encontrados no histórico: {}", orders.size());
        return ResponseEntity.ok(orders);
    }

    /**
     * FILTRA PRODUTOS
     */
    @GetMapping("/filter")
    public ResponseEntity<List<ProductDTO>> getFilteredProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String subcategory,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {
        log.info("#### FILTRAGEM CONTEXTUAL ####");
        return ResponseEntity.ok(productService.getFilteredProducts(
                category, subcategory, brand, gender, minPrice, maxPrice));
    }
}