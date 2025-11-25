package com.poo2.bio_factor.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private Long id;
    private String username;
    private String nome;

    private LocalDate birthDate;
    private char gender;

    private double weight;
    private double height;
    private double bodyFat;
    private int activityLevel;

    // Calculated metrics
    private double bodyMassIndex;
    private double basicMetabolicRate;
}