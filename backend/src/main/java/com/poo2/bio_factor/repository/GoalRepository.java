package com.poo2.bio_factor.repository;

import com.poo2.bio_factor.model.Goal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoalRepository extends JpaRepository<Goal, Long> {
    // Busca objetivos por status (útil para achar qual está Ativo)
    List<Goal> findByStatus(String status);
}
