// src/main/java/com/smartrecommender/controller/UserController.java
package com.smartrecommender.controller;

import com.smartrecommender.model.User;
import com.smartrecommender.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        // O JPA salvará o usuário e retornará o objeto com o ID gerado
        return ResponseEntity.ok(userRepository.save(user));
    }
}