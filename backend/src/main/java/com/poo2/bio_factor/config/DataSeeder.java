package com.poo2.bio_factor.config;

import com.poo2.bio_factor.model.Food;
import com.poo2.bio_factor.model.Exercise;
import com.poo2.bio_factor.model.Routine;
import com.poo2.bio_factor.model.Workout;
import com.poo2.bio_factor.repository.FoodRepository;
import com.poo2.bio_factor.repository.ExerciseRepository;
import com.poo2.bio_factor.repository.RoutineRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(
            FoodRepository foodRepository,
            RoutineRepository routineRepository,
            ExerciseRepository exerciseRepository) {
        
        return args -> {
            
            // --- PARTE 1: ALIMENTOS (Comidas) ---
            if (foodRepository.count() == 0) {
                foodRepository.saveAll(List.of(
                    new Food(null, "Arroz Branco (100g)", 130, 28, 0, 2, 100, null),
                    new Food(null, "Feijão Carioca (100g)", 76, 13, 0, 4, 100, null),
                    new Food(null, "Peito de Frango (100g)", 165, 0, 3, 31, 100, null),
                    new Food(null, "Ovo Cozido (unid)", 70, 0, 5, 6, 50, null),
                    new Food(null, "Banana Prata (unid)", 98, 26, 0, 1, 100, null),
                    new Food(null, "Aveia em Flocos (30g)", 110, 17, 2, 4, 30, null),
                    new Food(null, "Whey Protein (30g)", 120, 3, 1, 24, 30, null)
                ));
                System.out.println("✅ Lista de Alimentos criada!");
            }

            // --- PARTE 2: EXERCÍCIOS MODELO (Biblioteca) ---
            // Usamos workout = null para indicar que são modelos para serem copiados
            if (exerciseRepository.count() == 0) {
                exerciseRepository.saveAll(List.of(
                    new Exercise(null, "Supino Reto", "Peito", "ANAEROBIC", 4, 10, 20.0, 0, null),
                    new Exercise(null, "Crucifixo", "Peito", "ANAEROBIC", 3, 12, 12.0, 0, null),
                    new Exercise(null, "Agachamento Livre", "Pernas", "ANAEROBIC", 4, 10, 40.0, 0, null),
                    new Exercise(null, "Leg Press 45", "Pernas", "ANAEROBIC", 3, 12, 100.0, 0, null),
                    new Exercise(null, "Puxada Frontal", "Costas", "ANAEROBIC", 4, 10, 35.0, 0, null),
                    new Exercise(null, "Remada Curvada", "Costas", "ANAEROBIC", 4, 10, 30.0, 0, null),
                    new Exercise(null, "Desenvolvimento Halteres", "Ombros", "ANAEROBIC", 3, 12, 14.0, 0, null),
                    new Exercise(null, "Corrida Esteira", "Cardio", "AEROBIC", 0, 0, 0.0, 20, null),
                    new Exercise(null, "Bicicleta Ergométrica", "Cardio", "AEROBIC", 0, 0, 0.0, 30, null)
                ));
                System.out.println("✅ Biblioteca de Exercícios criada!");
            }

            // --- PARTE 3: ROTINA PADRÃO ---
            if (routineRepository.count() == 0) {
                Routine rotina = new Routine();
                rotina.setName("Rotina ABC - Hipertrofia");
                rotina.setGoal("Ganho de Massa");

                // Treino A
                Workout treinoA = new Workout();
                treinoA.setName("Treino A - Peito e Tríceps");
                treinoA.setDescription("Foco em empurrar");
                rotina.addWorkout(treinoA);

                // Treino B
                Workout treinoB = new Workout();
                treinoB.setName("Treino B - Costas e Bíceps");
                treinoB.setDescription("Foco em puxar");
                rotina.addWorkout(treinoB);

                // Treino C
                Workout treinoC = new Workout();
                treinoC.setName("Treino C - Pernas e Ombros");
                treinoC.setDescription("Foco em membros inferiores");
                rotina.addWorkout(treinoC);

                routineRepository.save(rotina);
                System.out.println("✅ Rotina Padrão ABC criada!");
            }
        };
    }
}
