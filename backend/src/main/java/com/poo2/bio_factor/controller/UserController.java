package com.poo2.bio_factor.controller;

import com.poo2.bio_factor.dto.UserDTO;
import com.poo2.bio_factor.dto.UserRegistrationDTO;
import com.poo2.bio_factor.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*") // Permite acesso do Front
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // 1. PEGAR USUÁRIO LOGADO (Atalho para o ID 1 para facilitar testes)
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser() {
        try {
            // Como não temos login real ainda, assumimos que o usuário é o ID 1
            return ResponseEntity.ok(userService.getUserMetricsById(1L));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 2. CADASTRAR NOVO USUÁRIO
    @PostMapping
    public ResponseEntity<?> registerUser(@RequestBody UserRegistrationDTO registrationDTO) {
        try {
            UserDTO createdUser = userService.registerUser(registrationDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        } catch (IllegalArgumentException e) {
            // Erro de validação (senhas não batem, usuário existe, etc)
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao criar usuário.");
        }
    }

    // 3. PEGAR USUÁRIO POR ID (Específico)
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserMetrics(@PathVariable Long id) {
        try {
            UserDTO userDTO = userService.getUserMetricsById(id);
            return ResponseEntity.ok(userDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
