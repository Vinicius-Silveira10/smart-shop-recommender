package com.smartrecommender.service;

import com.smartrecommender.dto.ProductDTO;
import com.smartrecommender.exception.ResourceNotFoundException;
import com.smartrecommender.model.Product;
import com.smartrecommender.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal; // 1. Importe o BigDecimal
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    private Product product;

    @BeforeEach
    void setUp() {
        product = new Product();
        product.setId(1L);
        product.setName("Advanced AI Processor");
        product.setCategory("Electronics");

        // 2. CORREÇÃO AQUI:
        // Use new BigDecimal("499.99") em vez de apenas 499.99
        product.setPrice(new BigDecimal("499.99"));
    }

    @Test
    @DisplayName("Deve retornar um produto quando o ID existe")
    void getProductById_WhenIdExists_ShouldReturnProduct() {
        // Given
        given(productRepository.findById(1L)).willReturn(Optional.of(product));

        // When
        ProductDTO foundProduct = productService.getProductById(1L);

        // Then
        assertThat(foundProduct).isNotNull();
        assertThat(foundProduct.getName()).isEqualTo("Advanced AI Processor");
        verify(productRepository).findById(1L);
    }

    @Test
    @DisplayName("Deve lançar ResourceNotFoundException quando o ID não existe")
    void getProductById_WhenIdDoesNotExist_ShouldThrowException() {
        // Given
        given(productRepository.findById(99L)).willReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> productService.getProductById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Product not found with id: 99");
    }
}