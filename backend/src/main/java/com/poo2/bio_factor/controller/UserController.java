package com.poo2.bio_factor.controller;

import com.poo2.bio_factor.dto.UserDTO;
import com.poo2.bio_factor.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/users") // Base path for all user operations
@CrossOrigin(origins = "http://localhost:5173") // Temporary CORS fix for development
public class UserController {

    private final UserService userService;

    // Dependency Injection (Spring injects the UserService)
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Handles GET requests to /api/users/{id}
     * Retrieves a user's metrics (including BMI/BMR) as a DTO.
     * @param id The ID of the user to retrieve.
     * @return The UserDTO containing all profile and calculated data.
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserMetrics(@PathVariable Long id) {
        try {
            UserDTO userDTO = userService.getUserMetricsById(id);
            // Return 200 OK with the DTO object
            return ResponseEntity.ok(userDTO);
        } catch (RuntimeException e) {
            // In a real application, you'd handle different exceptions (e.g., UserNotFoundException)
            // and return a specific status like 404 NOT FOUND.
            System.err.println(e.getMessage());
            return ResponseEntity.notFound().build(); // Return 404 Not Found
        }
    }

    // You will add more endpoints here later (e.g., POST for creating a user, PUT for updating)
}