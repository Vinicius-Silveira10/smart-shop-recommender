package com.smartrecommender.service;

import org.springframework.stereotype.Service;
import java.math.BigDecimal;

@Service
public class ShippingService {

    /**
     * Calcula o frete baseado no CEP e no valor total dos produtos.
     * 
     * @param cep        O CEP de destino enviado pelo Frontend.
     * @param totalValue O valor total do carrinho.
     * @return O valor do frete calculado.
     */
    public BigDecimal calculateShipping(String cep, BigDecimal totalValue) {
        // Remove caracteres não numéricos do CEP
        String cleanCep = cep.replaceAll("[^0-9]", "");

        // Valor base do frete
        BigDecimal shippingCost = new BigDecimal("25.00");

        // Regra de Simulação baseada na região (primeiro dígito do CEP)
        if (cleanCep.startsWith("0")) {
            // Regra para São Paulo (Grande SP)
            shippingCost = new BigDecimal("15.00");
        } else if (cleanCep.startsWith("2")) {
            // Regra para Rio de Janeiro / Espírito Santo
            shippingCost = new BigDecimal("20.00");
        } else if (cleanCep.length() != 8) {
            // CEP inválido ou não informado
            return BigDecimal.ZERO;
        }

        // Adiciona uma taxa de 1% do valor total dos produtos ao frete
        BigDecimal insurance = totalValue.multiply(new BigDecimal("0.01"));

        return shippingCost.add(insurance);
    }
}