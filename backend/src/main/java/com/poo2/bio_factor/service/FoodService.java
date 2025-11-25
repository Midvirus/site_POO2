package com.poo2.bio_factor.service;

import com.poo2.bio_factor.model.Food;
import com.poo2.bio_factor.repository.FoodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class FoodService {

    @Autowired
    private FoodRepository foodRepository;

    public Food saveFood(Food food) {
        if (food.getCalories() < 0) {
            throw new IllegalArgumentException("Calorias não podem ser negativas");
        }
        return foodRepository.save(food);
    }

    public List<Food> listAllFoods() {
        return foodRepository.findAll();
    }

    public Optional<Food> getFoodById(Long id) {
        return foodRepository.findById(id);
    }

    public void deleteFood(Long id) {
        foodRepository.deleteById(id);
    }
}
