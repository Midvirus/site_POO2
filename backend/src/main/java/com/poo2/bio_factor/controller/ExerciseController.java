package com.poo2.bio_factor.controller;

import com.poo2.bio_factor.model.Exercise;
import com.poo2.bio_factor.repository.ExerciseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exercises")
@CrossOrigin(origins = "*")
public class ExerciseController {

    @Autowired
    private ExerciseRepository exerciseRepository;

    // Busca apenas os exercícios que NÃO estão vinculados a treinos (Templates)
    @GetMapping("/templates")
    public List<Exercise> getTemplates() {
        return exerciseRepository.findByWorkoutIsNull();
    }
   // Deleta Exercicios do treino
   @DeleteMapping("/{id}")
    public void deleteExercise(@PathVariable Long id) {
        exerciseRepository.deleteById(id);
    }
}
