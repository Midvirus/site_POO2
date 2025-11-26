package com.poo2.bio_factor.controller;

import com.poo2.bio_factor.model.Goal;
import com.poo2.bio_factor.repository.GoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
@CrossOrigin(origins = "*")
public class GoalController {

    @Autowired
    private GoalRepository goalRepository;

    @GetMapping
    public List<Goal> getAll() {
        return goalRepository.findAll();
    }

    @PostMapping
    public Goal create(@RequestBody Goal goal) {
        // Regra de Negócio: Se criar um objetivo "Ativo", pausa os outros?
        // Por simplicidade, vamos deixar o usuário gerenciar, mas você poderia implementar isso aqui.
        return goalRepository.save(goal);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Goal> update(@PathVariable Long id, @RequestBody Goal goalDetails) {
        return goalRepository.findById(id)
                .map(goal -> {
                    goal.setFocus(goalDetails.getFocus());
                    goal.setStartWeight(goalDetails.getStartWeight());
                    goal.setTargetWeight(goalDetails.getTargetWeight());
                    goal.setStartDate(goalDetails.getStartDate());
                    goal.setEndDate(goalDetails.getEndDate());
                    goal.setStatus(goalDetails.getStatus());
                    return ResponseEntity.ok(goalRepository.save(goal));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        goalRepository.deleteById(id);
    }
}
