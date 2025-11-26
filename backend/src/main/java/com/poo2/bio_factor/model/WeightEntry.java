package com.poo2.bio_factor.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "weight_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WeightEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;
    private Double weight; // Peso em Kg
}
