package com.smartrecommender.service;

import com.smartrecommender.dto.ProductDTO;
import com.smartrecommender.model.Product;
import com.smartrecommender.model.Interaction;
import com.smartrecommender.model.Order;
import com.smartrecommender.model.OrderItem;
import com.smartrecommender.repository.ProductRepository;
import com.smartrecommender.repository.InteractionRepository;
import com.smartrecommender.repository.OrderRepository;
import com.smartrecommender.repository.OrderItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;
    private final InteractionRepository interactionRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    @jakarta.annotation.PostConstruct
    public void checkDatabase() {
        long count = productRepository.count();
        log.info(">>>> [CHECK BANCO] O Java encontrou {} produtos na inicialização.", count);
    }

    @Transactional
    public void savePurchase(Long userId, List<Long> productIds) {
        if (productIds == null || productIds.isEmpty())
            return;

        Order order = new Order();
        order.setUserId(userId);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("Pagamento Confirmado");

        List<Product> products = productRepository.findAllById(productIds);
        BigDecimal total = products.stream()
                .map(p -> p.getPrice() != null ? p.getPrice() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setTotalAmount(total);

        List<OrderItem> items = products.stream().map(product -> {
            OrderItem item = new OrderItem();
            item.setProductId(product.getId());
            item.setPriceAtPurchase(product.getPrice());
            item.setQuantity(1);
            registrarInteracaoIA(userId, product.getId());
            return item;
        }).collect(Collectors.toList());

        order.setItems(items);
        Order savedOrder = orderRepository.save(order);
        log.info("✅ Pedido #{} criado com {} itens para o usuário {}.", savedOrder.getId(), items.size(), userId);
    }

    private void registrarInteracaoIA(Long userId, Long productId) {
        Interaction interaction = new Interaction();
        interaction.setUserId(userId);
        interaction.setProductId(productId);
        interaction.setActionType("purchase");
        interaction.setTimestamp(LocalDateTime.now());
        interactionRepository.save(interaction);
    }

    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    // 🚀 ADICIONADO: Método de busca que o Controller estava solicitando
    public List<ProductDTO> searchProducts(String query) {
        List<Product> products = productRepository.findByNameContainingIgnoreCase(query);
        return products == null ? Collections.emptyList()
                : products.stream().map(p -> toDTOWithStatus(p, "Disponível")).collect(Collectors.toList());
    }

    private String calcularStatus(LocalDateTime purchaseTime) {
        long minutosParaEntrega = Duration.between(purchaseTime, LocalDateTime.now()).toMinutes();
        if (minutosParaEntrega < 2)
            return "Pagamento Confirmado";
        if (minutosParaEntrega < 5)
            return "Em Separação";
        if (minutosParaEntrega < 10)
            return "Em Rota (Fortaleza)";
        return "Entregue";
    }

    private ProductDTO toDTOWithStatus(Product product, String status) {
        return new ProductDTO(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice() != null ? product.getPrice().doubleValue() : 0.0,
                product.getCategory(),
                product.getSubcategory(),
                product.getImageUrl(),
                product.getStockQuantity(),
                product.getBrand(),
                product.getGender(),
                status);
    }

    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(p -> toDTOWithStatus(p, "Disponível"))
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getFilteredProducts(String category, String subcategory, String brand, String gender,
            BigDecimal min, BigDecimal max) {
        List<Product> products = productRepository.findWithFilters(category, subcategory, brand, gender, min, max);
        return products == null ? Collections.emptyList()
                : products.stream().map(p -> toDTOWithStatus(p, "Disponível")).collect(Collectors.toList());
    }

    public ProductDTO getProductById(Long id) {
        return productRepository.findById(id)
                .map(p -> toDTOWithStatus(p, "Disponível"))
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
    }
}