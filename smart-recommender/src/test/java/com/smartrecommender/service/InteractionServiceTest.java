package com.smartrecommender.service;

import com.smartrecommender.dto.InteractionDTO;
import com.smartrecommender.model.Interaction;
import com.smartrecommender.repository.InteractionRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class InteractionServiceTest {

    @Mock
    private InteractionRepository interactionRepository;

    @InjectMocks
    private InteractionService interactionService;

    @Test
    @DisplayName("Deve salvar uma única interação com sucesso")
    void saveInteraction_ShouldSaveSingleInteraction() {
        // Given (Dado)
        // O DTO já deve estar usando 'actionType' (da nossa correção anterior)
        InteractionDTO interactionDTO = new InteractionDTO(1L, 101L, "view", LocalDateTime.now());

        // When (Quando)
        interactionService.saveInteraction(interactionDTO);

        // Then (Então)
        ArgumentCaptor<Interaction> interactionCaptor = ArgumentCaptor.forClass(Interaction.class);
        verify(interactionRepository).save(interactionCaptor.capture());

        Interaction capturedInteraction = interactionCaptor.getValue();
        assertThat(capturedInteraction).isNotNull();
        assertThat(capturedInteraction.getUserId()).isEqualTo(1L);
        assertThat(capturedInteraction.getProductId()).isEqualTo(101L);

        // 1. CORREÇÃO DO ERRO: Mude de .getEventType() para .getActionType()
        assertThat(capturedInteraction.getActionType()).isEqualTo("view");
    }

    @Test
    @DisplayName("Deve salvar uma lista de interações (batch)")
    void saveInteractions_ShouldSaveListOfInteractions() {
        // Given (Dado)
        InteractionDTO interaction1 = new InteractionDTO(1L, 101L, "view", LocalDateTime.now());
        InteractionDTO interaction2 = new InteractionDTO(1L, 102L, "click", LocalDateTime.now());
        List<InteractionDTO> dtoList = List.of(interaction1, interaction2);

        // When (Quando)
        interactionService.saveInteractions(dtoList);

        // Then (Então)
        ArgumentCaptor<List<Interaction>> listCaptor = ArgumentCaptor.forClass(List.class);
        verify(interactionRepository).saveAll(listCaptor.capture());

        List<Interaction> capturedList = listCaptor.getValue();
        assertThat(capturedList).isNotNull();
        assertThat(capturedList.size()).isEqualTo(2);
        assertThat(capturedList.get(0).getProductId()).isEqualTo(101L);

        // 2. CORREÇÃO DO ERRO: Mude de .getEventType() para .getActionType()
        assertThat(capturedList.get(0).getActionType()).isEqualTo("view");
        assertThat(capturedList.get(1).getActionType()).isEqualTo("click");
    }
}