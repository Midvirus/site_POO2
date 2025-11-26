package com.poo2.bio_factor.controller;

import com.poo2.bio_factor.model.WeightEntry;
import com.poo2.bio_factor.repository.WeightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/weights")
@CrossOrigin(origins = "*")
public class WeightController {

    @Autowired
    private WeightRepository weightRepository;

    @GetMapping
    public List<WeightEntry> getHistory() {
        return weightRepository.findAllByOrderByDateAsc();
    }

    @PostMapping
    public WeightEntry addEntry(@RequestBody WeightEntry entry) {
        // Se a data não vier preenchida, usa a de hoje
        if (entry.getDate() == null) {
            entry.setDate(LocalDate.now());
        }
        return weightRepository.save(entry);
    }
    
    @DeleteMapping("/{id}")
    public void deleteEntry(@PathVariable Long id) {
        weightRepository.deleteById(id);
    }
}
