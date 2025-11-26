package com.poo2.bio_factor.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "workouts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Workout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;        // Ex: "Treino A", "Leg Day"
    private String description; // Ex: "Foco em hipertrofia"

    // Um Treino tem vários Exercícios
    @OneToMany(mappedBy = "workout", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Exercise> exercises = new ArrayList<>();

    // O Treino pertence a uma Rotina
    @ManyToOne
    @JoinColumn(name = "routine_id")
    @JsonIgnore
    private Routine routine;

    // Método auxiliar para adicionar exercício
    public void addExercise(Exercise exercise) {
        exercises.add(exercise);
        exercise.setWorkout(this);
    }
}
