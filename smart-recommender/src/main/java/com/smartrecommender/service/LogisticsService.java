package com.smartrecommender.service;

import com.smartrecommender.model.Order;
import com.smartrecommender.model.OrderStatus;
import com.smartrecommender.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import java.util.concurrent.TimeUnit;

@Service
public class LogisticsService {

    @Autowired
    private OrderRepository orderRepository;

    /**
     * Simula o ciclo de vida de entrega sem bloquear o thread principal.
     * Não utiliza variáveis globais; cada execução é isolada por ID de pedido.
     */
    @Async
    public void simulateDeliveryLifecycle(Long orderId) {
        try {
            // 1. Espera 1 minuto para mudar para ENVIADO (SHIPPED)
            TimeUnit.MINUTES.sleep(1);
            updateStatus(orderId, OrderStatus.SHIPPED);

            // 2. Espera mais 2 minutos para mudar para ENTREGUE (DELIVERED)
            TimeUnit.MINUTES.sleep(2);
            updateStatus(orderId, OrderStatus.DELIVERED);

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    private void updateStatus(Long orderId, OrderStatus newStatus) {
        orderRepository.findById(orderId).ifPresent(order -> {
            order.setStatus(newStatus.name());
            orderRepository.save(order);
            System.out.println("LOGISTICA: Pedido #" + orderId + " atualizado para " + newStatus);
        });
    }
}