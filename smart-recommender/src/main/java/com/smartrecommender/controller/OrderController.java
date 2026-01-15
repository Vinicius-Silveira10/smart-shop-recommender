package com.smartrecommender.controller;

import com.smartrecommender.model.Order;
import com.smartrecommender.model.OrderStatus;
import com.smartrecommender.repository.OrderRepository;
import com.smartrecommender.service.LogisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", methods = { RequestMethod.GET,
        RequestMethod.POST })
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private LogisticsService logisticsService;

    /**
     * Retorna o histórico de pedidos para a página Orders.tsx.
     */
    // No seu OrderController.java

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUser(@PathVariable Long userId) {
        List<Order> orders = orderRepository.findByUserId(userId);

        // Log para você conferir no console do Java se os dados estão vindo
        System.out.println("Pedidos encontrados para o usuário " + userId + ": " + orders.size());

        return ResponseEntity.ok(orders);
    }

    /**
     * Endpoint de Checkout: Inicia a persistência e a logística assíncrona.
     * RESOLVE: Sem variáveis globais, cada thread é isolada por ID.
     */
    @PostMapping("/checkout")
    public ResponseEntity<Order> checkout(@RequestBody Order order) {
        // 1. Define o status inicial via Enum para evitar "Strings mágicas"
        order.setStatus(OrderStatus.PROCESSING.name());

        // 2. Grava no banco de dados (O @PrePersist no Order.java cuidará da data)
        Order savedOrder = orderRepository.save(order);

        // 3. Dispara o ciclo de vida da logística em segundo plano
        // O ID é passado como parâmetro, mantendo a statelessness do serviço.
        logisticsService.simulateDeliveryLifecycle(savedOrder.getId());

        return ResponseEntity.ok(savedOrder);
    }
}