package com.smartrecommender.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Data
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long id;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private BigDecimal price;
    private String category;

    // Campo para subfiltros (ex: Mouse, Teclado, Camiseta)
    @Column(name = "subcategory")
    private String subcategory;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "stock_quantity")
    private Integer stockQuantity;

    @Column(name = "brand")
    private String brand;

    // Novo: Filtro de Gênero para a categoria Roupas
    @Column(name = "gender")
    private String gender; // 'M' (Masculino), 'F' (Feminino), 'U' (Unissex)
}