package com.smartrecommender.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Data
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id")
    @JsonProperty("product_id") // Padroniza para o React
    private Long productId;

    private Integer quantity;

    @Column(name = "price_at_purchase")
    @JsonProperty("price_at_purchase") // Padroniza para o React
    private BigDecimal priceAtPurchase;
}