package com.smartrecommender.repository;

import com.smartrecommender.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    // Define a busca personalizada por ID de usuário
    List<Order> findByUserId(Long userId);
}