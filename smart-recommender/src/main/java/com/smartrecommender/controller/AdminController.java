package com.smartrecommender.controller;

import com.smartrecommender.integration.MLClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final MLClient mlClient;

    @PostMapping("/ml/train")
    public ResponseEntity<String> triggerTraining() {
        mlClient.triggerModelTraining();
        return ResponseEntity.ok("Model training process triggered successfully.");
    }
}