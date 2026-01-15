package com.smartrecommender.controller;

import com.smartrecommender.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;

    // MÉTODO DE TESTE: Acesse http://localhost:8081/auth/test no navegador
    @GetMapping("/test")
    public String test() {
        return "O Controller de Autenticação está FUNCIONANDO!";
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        // ADICIONE ESTA LINHA PARA DEBUG:
        System.out.println(">>> TENTATIVA DE LOGIN RECEBIDA: " + username);

        return userRepository.findAll().stream()
                .filter(u -> u.getUsername().equals(username) && u.getPassword().equals(password))
                .findFirst()
                .map(user -> ResponseEntity.ok(user))
                .orElseGet(() -> {
                    System.out.println(">>> USUÁRIO NÃO ENCONTRADO NO BANCO!");
                    return ResponseEntity.status(401).build();
                });
    }
}