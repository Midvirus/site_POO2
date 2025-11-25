package com.poo2.bio_factor.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    // TEMPORARY: This field currently stores the raw, unhashed password string.
    // MUST be changed to store a securely hashed password later.
    @Column(nullable = false)
    private String hashedPassword;

    @Column(nullable = false)
    private String nome;

    private char gender; // M/F

    private double weight; // in kg
    private double height; // in cm
    private double bodyFat; // percentage

    private int activityLevel; // Used in BMR calculation (e.g., 1-5)

    @Column(nullable = false)
    private LocalDate birthDate;

    // Relationships (will be added here later: List<Routine>, List<Meal>, etc.)
}