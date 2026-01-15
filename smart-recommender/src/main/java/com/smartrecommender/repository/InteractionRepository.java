package com.smartrecommender.repository;

import com.smartrecommender.model.Interaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InteractionRepository extends JpaRepository<Interaction, Long> {
    // Busca todas as interações de um usuário filtradas por tipo (ex: 'purchase')
    List<Interaction> findByUserIdAndActionTypeOrderByTimestampDesc(Long userId, String actionType);
}