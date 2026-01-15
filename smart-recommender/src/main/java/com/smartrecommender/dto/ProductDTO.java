package com.smartrecommender.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para transferência de dados de produtos.
 * Sincronizado com o Status de Pedido e Filtros Contextuais.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private Double price;       // 4º campo
    private String category;    // 5º campo
    private String subcategory; // 6º campo
    private String imageUrl;    // 7º campo
    private Integer stockQuantity; // 8º campo
    private String brand;       // 9º campo
    private String gender;      // 10º campo
    private String status;      // 11º campo (Status no final para clareza)
}