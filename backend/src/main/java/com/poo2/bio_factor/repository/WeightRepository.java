package com.poo2.bio_factor.repository;

import com.poo2.bio_factor.model.WeightEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WeightRepository extends JpaRepository<WeightEntry, Long> {
    // Busca ordenado por data (do mais antigo para o mais novo) para o gráfico ficar na ordem certa
    List<WeightEntry> findAllByOrderByDateAsc();
}
