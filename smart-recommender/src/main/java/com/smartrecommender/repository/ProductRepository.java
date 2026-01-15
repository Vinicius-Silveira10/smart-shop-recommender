package com.smartrecommender.repository;

import com.smartrecommender.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

        // Busca por nome (usada na barra de pesquisa superior)
        List<Product> findByNameContainingIgnoreCase(String name);

        // Busca rápida por categoria
        List<Product> findByCategoryIgnoreCase(String category);

        // Método de Filtros Avançados (Hierárquico e Preço)
        // O uso de (:param IS NULL OR p.field = :param) permite que o filtro seja
        // opcional
        @Query("SELECT p FROM Product p WHERE " +
                        "(:category IS NULL OR p.category = :category) AND " +
                        "(:subcategory IS NULL OR :subcategory = '' OR p.subcategory = :subcategory) AND " +
                        "(:brand IS NULL OR :brand = '' OR p.brand = :brand) AND " +
                        "(:gender IS NULL OR :gender = '' OR p.gender = :gender) AND " +
                        "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
                        "(:maxPrice IS NULL OR p.price <= :maxPrice)")
        List<Product> findWithFilters(
                        @Param("category") String category,
                        @Param("subcategory") String subcategory,
                        @Param("brand") String brand,
                        @Param("gender") String gender,
                        @Param("minPrice") BigDecimal minPrice,
                        @Param("maxPrice") BigDecimal maxPrice);
}