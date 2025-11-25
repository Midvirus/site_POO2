package com.poo2.bio_factor.service;

import com.poo2.bio_factor.dto.UserDTO;
import com.poo2.bio_factor.model.User;
import com.poo2.bio_factor.dto.UserRegistrationDTO;
import com.poo2.bio_factor.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.Period;

@Service
public class UserService {

    private final UserRepository userRepository;

    // Constructor Injection (Spring automatically provides the UserRepository instance)
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Registers a new user in the system.
     * * IMPORTANT SECURITY WARNING: This method temporarily stores the raw, unhashed
     * password as requested. This MUST be replaced with hashing (e.g., BCrypt)
     * before production use.
     * * @param registrationDTO The DTO containing all user registration data.
     * @return UserDTO containing the saved user data and initial calculated metrics.
     * @throws IllegalArgumentException if passwords do not match or username is already taken.
     */
    @Transactional
    public UserDTO registerUser(UserRegistrationDTO registrationDTO) {

        // 1. Validation Checks (Password Match)
        if (!registrationDTO.getPassword().equals(registrationDTO.getConfirmPassword())) {
            throw new IllegalArgumentException("A senha e a confirmação de senha não coincidem.");
        }

        // 2. Validation Checks (Username Uniqueness)
        if (userRepository.findByUsername(registrationDTO.getUsername()).isPresent()) {
            throw new IllegalArgumentException("O nome de usuário já está em uso.");
        }

        // 3. Create the Entity and Map Data
        User newUser = new User();
        newUser.setUsername(registrationDTO.getUsername());

        // --- INSECURE STEP: Storing RAW password ---
        newUser.setHashedPassword(registrationDTO.getPassword());
        // ------------------------------------------

        newUser.setNome(registrationDTO.getNome());
        newUser.setBirthDate(registrationDTO.getBirthDate());
        newUser.setGender(registrationDTO.getGender());
        newUser.setWeight(registrationDTO.getWeight());
        newUser.setHeight(registrationDTO.getHeight());
        newUser.setActivityLevel(registrationDTO.getActivityLevel());

        // Initialize default fields
        newUser.setBodyFat(0.0);

        // 4. Save to Database
        User savedUser = userRepository.save(newUser);

        // 5. Return DTO with calculated initial metrics
        return mapEntityToDTO(savedUser);
    }

    // --- Public Service Method for Retrieval ---

    public UserDTO getUserMetricsById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id)); // Use a custom exception in a real app

        // Map the entity to the DTO and calculate metrics
        return mapEntityToDTO(user);
    }

    // --- Business Logic Methods (Calculations) ---

    private int calcAge(LocalDate birthDate) {
        return Period.between(birthDate, LocalDate.now()).getYears();
    }

    // BMI = weight (kg) / height^2 (m^2)
    private double calcBodyMassIndex(double weightKg, double heightCm) {
        // Convert height from cm to meters
        double heightM = heightCm / 100.0;
        // Note: Your original formula was slightly incorrect. Correct formula: weight / height^2
        return weightKg / Math.pow(heightM, 2);
    }

    // BMR (Mifflin-St Jeor Equation, adjusted for activity)
    private double calcBasicMetabolicRate(char gender, double heightCm, double weightKg, int age, int activityLevel) {
        double bmr;

        if (gender == 'M') {
            // Men: (10 * weight) + (6.25 * height) - (5 * age) + 5
            bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5;
        } else {
            // Women: (10 * weight) + (6.25 * height) - (5 * age) - 161
            bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;
        }

        // This is the BMR. To get TDEE (Total Daily Energy Expenditure), we multiply by an activity factor.
        // Assuming activityLevel maps to a simple factor:
        double activityFactor = getActivityFactor(activityLevel);

        return bmr * activityFactor;
    }

    // Helper function for BMR activity factor
    private double getActivityFactor(int level) {
        // Example factors based on common scales (adjust as needed)
        return switch (level) {
            case 1 -> 1.2; // Sedentary
            case 2 -> 1.375; // Lightly Active
            case 3 -> 1.55; // Moderately Active
            case 4 -> 1.725; // Very Active
            case 5 -> 1.9; // Extremely Active
            default -> 1.2; // Default to sedentary
        };
    }

    // --- Mapping Logic ---

    private UserDTO mapEntityToDTO(User user) {
        // 1. Calculate required values
        int age = calcAge(user.getBirthDate());
        double bmi = calcBodyMassIndex(user.getWeight(), user.getHeight());
        double bmr = calcBasicMetabolicRate(user.getGender(), user.getHeight(), user.getWeight(), age, user.getActivityLevel());

        // 2. Create and populate DTO
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setNome(user.getNome());
        dto.setBirthDate(user.getBirthDate());
        dto.setGender(user.getGender());
        dto.setWeight(user.getWeight());
        dto.setHeight(user.getHeight());
        dto.setBodyFat(user.getBodyFat());
        dto.setActivityLevel(user.getActivityLevel());

        // Set calculated values
        dto.setBodyMassIndex(bmi);
        dto.setBasicMetabolicRate(bmr);

        return dto;
    }
}