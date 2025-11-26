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
        // Garante a integridade dos relacionamentos antes de salvar
        if (routine.getWorkouts() != null) {
            for (Workout workout : routine.getWorkouts()) {
                workout.setRoutine(routine);
                if (workout.getExercises() != null) {
                    for (Exercise exercise : workout.getExercises()) {
                        exercise.setWorkout(workout);
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

    // Método que busca pelo objetivo (Chamado pelo Controller)
    public Routine getRoutineByGoal(String goal) {
        List<Routine> routines = routineRepository.findByGoal(goal);
        if (!routines.isEmpty()) {
            return routines.get(0);
        }
        return null;
    }
}
