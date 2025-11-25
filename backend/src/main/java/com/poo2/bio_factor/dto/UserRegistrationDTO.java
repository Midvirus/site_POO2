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
public class UserRegistrationDTO {

    private String username;
    private String password;
    private String confirmPassword;

    private String nome;
    private LocalDate birthDate;
    private char gender;

    private double weight;
    private double height;
    private int activityLevel;
}