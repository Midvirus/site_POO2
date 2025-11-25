package com.poo2.bio_factor.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "meals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Meal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime dateTime; // antigo 'dataHora'

    private String type; // antigo 'tipo' (ex: "Almoço", "Janta")

    // Totais (Serão calculados automaticamente)
    private int totalCalories;
    private int totalCarbs;
    private int totalFats;    // antigo 'totalGords'
    private int totalProtein;

    // Relacionamento: Uma Refeição tem várias Comidas
    // cascade = ALL: Se deletar a refeição, deleta as comidas dela junto
    @OneToMany(mappedBy = "meal", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Food> foods = new ArrayList<>();

    // Relacionamento: A Refeição pertence a um Usuário
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // --- MÉTODOS AUXILIARES ---

    // Método inteligente para adicionar comida e já atualizar os totais
    public void addFood(Food food) {
        foods.add(food);
        food.setMeal(this); // Vincula a comida a esta refeição
        calculateTotals();
    }

    // Método inteligente para remover comida e atualizar totais
    public void removeFood(Food food) {
        foods.remove(food);
        food.setMeal(null);
        calculateTotals();
    }

    // Recalcula todos os macros somando a lista de comidas
    public void calculateTotals() {
        this.totalCalories = 0;
        this.totalCarbs = 0;
        this.totalFats = 0;
        this.totalProtein = 0;

        for (Food f : foods) {
            this.totalCalories += f.getCalories();
            this.totalCarbs += f.getCarbs();
            this.totalFats += f.getFats();
            this.totalProtein += f.getProtein();
        }
    }
}
