package com.poo2.bio_factor;

import com.poo2.bio_factor.model.User;
import com.poo2.bio_factor.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDate;

@SpringBootApplication
public class BioFactorApplication {

	public static void main(String[] args) {
		SpringApplication.run(BioFactorApplication.class, args);
	}

    @Bean
    public CommandLineRunner demoData(UserRepository userRepository) {
        return (args) -> {
            if (userRepository.findById(1L).isEmpty()) {

                User testUser = new User(
                        null,
                        "testuser",
                        "hash_password",
                        "Testing User da Silva",
                        'M',
                        70.0,
                        175.0,
                        22.0,
                        3,
                        LocalDate.of(1999, 8, 29)
                );

                userRepository.save(testUser);
                System.out.println("--- Test User (ID 1) saved to PostgreSQL ---");
            }
        };
    }

}
