package com.poo2.bio_factor.config;

import com.poo2.bio_factor.model.Food;
import com.poo2.bio_factor.repository.FoodRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(FoodRepository repository) {
        return args -> {
            // Só adiciona se o banco estiver vazio para não duplicar
            if (repository.count() == 0) {
                repository.saveAll(List.of(
                    new Food(null, "Arroz Branco (100g)", 130, 28, 0, 2, 100, null),
                    new Food(null, "Feijão Carioca (100g)", 76, 13, 0, 4, 100, null),
                    new Food(null, "Peito de Frango (100g)", 165, 0, 3, 31, 100, null),
                    new Food(null, "Ovo Cozido (unid)", 70, 0, 5, 6, 50, null),
                    new Food(null, "Banana Prata (unid)", 98, 26, 0, 1, 100, null),
                    new Food(null, "Aveia em Flocos (30g)", 110, 17, 2, 4, 30, null),
                    new Food(null, "Whey Protein (30g)", 120, 3, 1, 24, 30, null)
                ));
                System.out.println("✅ Banco de dados populado com alimentos iniciais!");
            }
        };
    }
}
