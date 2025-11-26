package com.poo2.bio_factor.service;

import com.poo2.bio_factor.model.Exercise;
import com.poo2.bio_factor.model.Routine;
import com.poo2.bio_factor.model.Workout;
import com.poo2.bio_factor.repository.RoutineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoutineService {

    @Autowired
    private RoutineRepository routineRepository;

    public List<Routine> getAllRoutines() {
        return routineRepository.findAll();
    }

    public Routine saveRoutine(Routine routine) {
        // Garante que os relacionamentos estão vinculados antes de salvar
        if (routine.getWorkouts() != null) {
            for (Workout workout : routine.getWorkouts()) {
                workout.setRoutine(routine); // Vincula Treino à Rotina
                
                if (workout.getExercises() != null) {
                    for (Exercise exercise : workout.getExercises()) {
                        exercise.setWorkout(workout); // Vincula Exercício ao Treino
                    }
                }
            }
        }
        return routineRepository.save(routine);
    }

    public void deleteRoutine(Long id) {
        routineRepository.deleteById(id);
    }
    
    public Optional<Routine> getRoutineById(Long id) {
        return routineRepository.findById(id);
    }
    public Routine getRoutineByGoal(String goal) {
        // Busca todas as rotinas com esse objetivo
        List<Routine> routines = routineRepository.findByGoal(goal);
        
        // Se a lista não estiver vazia, retorna a primeira. Senão, retorna null.
        if (!routines.isEmpty()) {
            return routines.get(0);
        }
        return null;
    }
}
