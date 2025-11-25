package com.poo2.bio_factor.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "foods")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Food {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // antigo 'nome'

    private int calories; // antigo 'calorias'
    private int carbs;    // antigo 'carbs'
    private int fats;     // antigo 'gords'
    private int protein;  // antigo 'proteinas'
    private int quantity; // antigo 'quant' (em gramas ou unidades)

    // Relacionamento: Muitas comidas pertencem a uma Refeição
    @ManyToOne
    @JoinColumn(name = "meal_id")
    @JsonIgnore // Evita loop infinito ao converter para JSON
    private Meal meal;
}
