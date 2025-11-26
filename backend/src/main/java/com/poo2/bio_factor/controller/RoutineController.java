package com.poo2.bio_factor.controller;

import com.poo2.bio_factor.model.Routine;
import com.poo2.bio_factor.service.RoutineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/routines")
@CrossOrigin(origins = "*")
public class RoutineController {

    @Autowired
    private RoutineService routineService;

    @GetMapping
    public List<Routine> getAll() {
        return routineService.getAllRoutines();
    }

    @PostMapping
    public Routine create(@RequestBody Routine routine) {
        return routineService.saveRoutine(routine);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        routineService.deleteRoutine(id);
        return ResponseEntity.noContent().build();
    }
}
