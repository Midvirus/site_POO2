package com.poo2.bio_factor.repository;

import com.poo2.bio_factor.model.Routine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoutineRepository extends JpaRepository<Routine, Long> {
  List<Routine> findByGoal(String goal);
}
