package com.poo2.bio_factor.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "goals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Goal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String focus; // "Ganho de Massa", "Perda de Peso", etc.
    
    private Double startWeight;
    private Double targetWeight;
    
    private LocalDate startDate;
    private LocalDate endDate;
    
    private String status; // "Ativo", "Pausado", "Concluído"
}
