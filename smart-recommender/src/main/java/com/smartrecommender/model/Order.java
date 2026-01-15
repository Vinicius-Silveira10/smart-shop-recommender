package com.smartrecommender.model;

import com.fasterxml.jackson.annotation.JsonProperty; // IMPORTANTE
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    @JsonProperty("user_id") // Sincroniza com o banco e React
    private Long userId;

    @Column(name = "total_amount")
    @JsonProperty("total_amount") // RESOLVE O ERRO DE R$ 0,00
    private BigDecimal totalAmount;

    private String status;

    @Column(name = "order_date", updatable = false)
    @JsonProperty("order_date") // Sincroniza a data com o banco
    private LocalDateTime orderDate;

    @PrePersist
    protected void onCreate() {
        this.orderDate = LocalDateTime.now();
        if (this.status == null) this.status = "COMPLETED";
    }

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "order_id")
    private List<OrderItem> items;
}