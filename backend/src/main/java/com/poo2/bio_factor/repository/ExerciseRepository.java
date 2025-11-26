package com.poo2.bio_factor.repository;

import com.poo2.bio_factor.model.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    
    // Esse método mágico busca todos os exercícios onde o campo "workout" é NULL.
    // Ou seja, traz só os modelos da biblioteca, e não os exercícios que já estão dentro de treinos de alguém.
    List<Exercise> findByWorkoutIsNull();
}
