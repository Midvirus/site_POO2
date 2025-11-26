package com.poo2.bio_factor.controller;

import com.poo2.bio_factor.dto.UserDTO;
import com.poo2.bio_factor.dto.UserRegistrationDTO;
import com.poo2.bio_factor.model.User;
import com.poo2.bio_factor.repository.UserRepository;
import com.poo2.bio_factor.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;
    
    @Autowired
    private UserRepository userRepository; // Injetamos o repository para buscar a senha

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // --- NOVO ENDPOINT DE LOGIN REAL ---
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Compara a senha enviada com a do banco
            if (user.getHashedPassword().equals(password)) {
                // Login Sucesso! Retorna o ID e Nome
                return ResponseEntity.ok(Map.of(
                    "id", user.getId(),
                    "nome", user.getNome(),
                    "message", "Login realizado com sucesso"
                ));
            }
        }
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário ou senha inválidos.");
    }

    // --- MÉTODOS ANTIGOS (Mantidos) ---

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser() {
        try {
            return ResponseEntity.ok(userService.getUserMetricsById(1L));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> registerUser(@RequestBody UserRegistrationDTO registrationDTO) {
        try {
            UserDTO createdUser = userService.registerUser(registrationDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao criar usuário.");
        }
    }

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
