package com.poo2.bio_factor.config;

import com.poo2.bio_factor.model.Food;
import com.poo2.bio_factor.model.Exercise;
import com.poo2.bio_factor.model.Routine;
import com.poo2.bio_factor.model.Workout;
import com.poo2.bio_factor.repository.FoodRepository;
import com.poo2.bio_factor.repository.ExerciseRepository;
import com.poo2.bio_factor.repository.RoutineRepository;
import com.poo2.bio_factor.model.WeightEntry;
import com.poo2.bio_factor.repository.WeightRepository;
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
            ExerciseRepository exerciseRepository,
            WeightRepository weightRepository) {
        
        return args -> {
            
            // 1. ALIMENTOS
            if (foodRepository.count() == 0) {
                foodRepository.saveAll(List.of(
                    new Food(null, "Arroz Branco (100g)", 130, 28, 0, 2, 100, null),
                    new Food(null, "Feijão Carioca (100g)", 76, 13, 0, 4, 100, null),
                    new Food(null, "Peito de Frango (100g)", 165, 0, 3, 31, 100, null),
                    new Food(null, "Ovo Cozido (unid)", 70, 0, 5, 6, 50, null),
                    new Food(null, "Banana Prata (unid)", 98, 26, 0, 1, 100, null),
                    new Food(null, "Salada de Folhas", 15, 3, 0, 1, 100, null)
                ));
            }

            // 2. EXERCÍCIOS (BIBLIOTECA)
            if (exerciseRepository.count() == 0) {
                exerciseRepository.saveAll(List.of(
                    // Musculação
                    new Exercise(null, "Supino Reto", "Peito", "ANAEROBIC", 4, 10, 20.0, 0, null),
                    new Exercise(null, "Agachamento Livre", "Pernas", "ANAEROBIC", 4, 10, 40.0, 0, null),
                    new Exercise(null, "Puxada Frontal", "Costas", "ANAEROBIC", 4, 10, 35.0, 0, null),
                    // Funcional / Perda de Peso
                    new Exercise(null, "Burpees", "Corpo Todo", "ANAEROBIC", 3, 15, 0.0, 0, null),
                    new Exercise(null, "Polichinelos", "Cardio", "AEROBIC", 0, 0, 0.0, 5, null),
                    new Exercise(null, "Pular Corda", "Cardio", "AEROBIC", 0, 0, 0.0, 10, null),
                    new Exercise(null, "Mountain Climbers", "Abdômen", "ANAEROBIC", 3, 20, 0.0, 0, null),
                    // Cardio Puro
                    new Exercise(null, "Corrida Esteira", "Cardio", "AEROBIC", 0, 0, 0.0, 30, null),
                    new Exercise(null, "Bicicleta Ergométrica", "Cardio", "AEROBIC", 0, 0, 0.0, 45, null),
                    new Exercise(null, "Natação", "Corpo Todo", "AEROBIC", 0, 0, 0.0, 40, null)
                ));
            }

            // 3. ROTINAS (3 TIPOS)
            if (routineRepository.count() == 0) {
                
                // --- ROTINA 1: GANHO DE MASSA ---
                Routine rotinaMassa = new Routine();
                rotinaMassa.setName("Hipertrofia Clássica");
                rotinaMassa.setGoal("Ganho de Massa"); // ID do objetivo
                
                Workout massaA = new Workout(null, "Treino A - Peito/Tríceps", "Foco em carga alta", null, rotinaMassa);
                Workout massaB = new Workout(null, "Treino B - Costas/Bíceps", "Foco em contração", null, rotinaMassa);
                rotinaMassa.addWorkout(massaA);
                rotinaMassa.addWorkout(massaB);
                routineRepository.save(rotinaMassa);

                // --- ROTINA 2: PERDA DE PESO ---
                Routine rotinaPeso = new Routine();
                rotinaPeso.setName("Queima de Gordura (HIIT)");
                rotinaPeso.setGoal("Perda de Peso"); // ID do objetivo

                Workout pesoA = new Workout(null, "Treino A - Circuito Metabólico", "Alta intensidade, pouco descanso", null, rotinaPeso);
                Workout pesoB = new Workout(null, "Treino B - Cardio Intenso", "Esteira e Corda", null, rotinaPeso);
                rotinaPeso.addWorkout(pesoA);
                rotinaPeso.addWorkout(pesoB);
                routineRepository.save(rotinaPeso);

                // --- ROTINA 3: CARDIORESPIRATÓRIO ---
                Routine rotinaCardio = new Routine();
                rotinaCardio.setName("Resistência & Fôlego");
                rotinaCardio.setGoal("Cardiorespiratório"); // ID do objetivo

                Workout cardioA = new Workout(null, "Treino A - Longa Distância", "Corrida leve e contínua", null, rotinaCardio);
                Workout cardioB = new Workout(null, "Treino B - Natação/Bike", "Impacto reduzido", null, rotinaCardio);
                rotinaCardio.addWorkout(cardioA);
                rotinaCardio.addWorkout(cardioB);
                routineRepository.save(rotinaCardio);

                System.out.println("✅ 3 Rotinas criadas com sucesso!");
            }
            // 4. HISTÓRICO DE PESO (Simulando um ano inteiro)
            if (weightRepository.count() == 0) {
                int anoAtual = java.time.LocalDate.now().getYear();
                
                weightRepository.saveAll(List.of(
                    // Janeiro - Começou o ano
                    new WeightEntry(null, java.time.LocalDate.of(anoAtual, 1, 10), 90.0),
                    new WeightEntry(null, java.time.LocalDate.of(anoAtual, 1, 25), 89.5),
                    
                    // Fevereiro
                    new WeightEntry(null, java.time.LocalDate.of(anoAtual, 2, 15), 88.0),
                    
                    // Março
                    new WeightEntry(null, java.time.LocalDate.of(anoAtual, 3, 10), 87.2),
                    
                    // Abril
                    new WeightEntry(null, java.time.LocalDate.of(anoAtual, 4, 5), 86.5),
                    
                    // Maio
                    new WeightEntry(null, java.time.LocalDate.of(anoAtual, 5, 20), 86.0),
                    
                    // Dados recentes (últimos 30 dias)
                    new WeightEntry(null, java.time.LocalDate.now().minusDays(15), 85.0),
                    new WeightEntry(null, java.time.LocalDate.now(), 84.5)
                ));
                System.out.println("✅ Histórico anual criado!");
            }
        };
    }
}
