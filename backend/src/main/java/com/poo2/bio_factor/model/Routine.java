package com.poo2.bio_factor.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "routines")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Routine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;        // Ex: "Iniciante", "ABC 2x"
    private String goal;        // Ex: "Perda de Peso"
    
    // Uma Rotina tem vários Treinos
    @OneToMany(mappedBy = "routine", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Workout> workouts = new ArrayList<>();

    // Método auxiliar para adicionar treino
    public void addWorkout(Workout workout) {
        workouts.add(workout);
        workout.setRoutine(this);
    }
}
