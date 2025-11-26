package com.poo2.bio_factor.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "exercises")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;        // Ex: Supino, Corrida
    private String muscleGroup; // Ex: Peito, Pernas
    private String type;        // "AEROBIC" ou "ANAEROBIC"

    // Campos para Anaeróbico (Musculação)
    private Integer sets;       // Séries
    private Integer reps;       // Repetições
    private Double loadWeight;  // Carga (kg)

    // Campos para Aeróbico (Cardio)
    private Integer duration;   // Minutos

    // Relacionamento: O exercício pertence a um Treino
    @ManyToOne
    @JoinColumn(name = "workout_id")
    @JsonIgnore
    private Workout workout;
}
