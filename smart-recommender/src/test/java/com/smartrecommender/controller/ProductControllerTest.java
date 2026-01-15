package com.smartrecommender.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("default")
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("Deve retornar 200 OK e a lista de produtos ao chamar GET /api/products")
    void getProducts_ShouldReturnProductList() throws Exception {

        // CORREÇÃO AQUI: "/api/produtos" mudou para "/api/products"
        mockMvc.perform(get("/api/products"))

                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[0].name").value("Processador IA"))
                .andExpect(jsonPath("$.[1].name").value("Livro de Arquitetura"));
    }

    @Test
    @DisplayName("Deve retornar 200 OK e o produto correto ao chamar GET /api/products/{id}")
    void getProductById_WhenIdExists_ShouldReturnProduct() throws Exception {

        // CORREÇÃO AQUI: "/api/produtos/1" mudou para "/api/products/1"
        mockMvc.perform(get("/api/products/1"))

                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.name").value("Processador IA"))
                .andExpect(jsonPath("$.category").value("Eletrônicos"));
    }

    @Test
    @DisplayName("Deve retornar 404 Not Found ao chamar GET /api/products/{id} com ID inexistente")
    void getProductById_WhenIdDoesNotExist_ShouldReturn404() throws Exception {

        // CORREÇÃO AQUI: "/api/produtos/999" mudou para "/api/products/999"
        mockMvc.perform(get("/api/products/999"))

                .andExpect(status().isNotFound());
    }
}