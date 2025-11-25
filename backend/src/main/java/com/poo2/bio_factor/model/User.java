package com.poo2.bio_factor.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.Period;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    // TEMPORARY: This field currently stores the raw, unhashed password string.
    @Column(nullable = false)
    private String hashedPassword;

    @Column(nullable = false)
    private String nome;

    private char gender; // 'M' ou 'F'

    private double weight; // em kg
    private double height; // em cm (ATENÇÃO: O cálculo de IMC exige conversão para metros)
    private double bodyFat; // percentual

    private int activityLevel; // 1 a 5

    @Column(nullable = false)
    private LocalDate birthDate;

    // --- MÉTODOS DE LÓGICA DE NEGÓCIO ---

    // Calcula a idade atual baseada na data de nascimento
    public int getAge() {
        if (this.birthDate == null) return 0;
        return Period.between(this.birthDate, LocalDate.now()).getYears();
    }

    // Índice de Massa Corporal (IMC)
    public double calcImc() {
        if (this.height > 0) {
            // Converte CM para Metros antes de calcular
            double heightInMeters = this.height / 100.0;
            return this.weight / (heightInMeters * heightInMeters);
        }
        return 0;
    }

    // Taxa Metabólica Basal (Basal Metabolic Rate - BMR)
    // Fórmula de Harris-Benedict
    public double calcBmr() {
        int age = getAge();
        
        // A fórmula usa altura em CM, então usamos this.height direto
        if (gender == 'M' || gender == 'm') {
            return 88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age);
        } else {
            // Assume feminino como padrão se não for M
            return 447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age);
        }
    }

    // Gasto Energético Diário Total (Total Daily Energy Expenditure)
    public double calcTdee() { // Antigo calcGedt
        double bmr = calcBmr();
        double activityFactor;

        switch (activityLevel) {
            case 1: activityFactor = 1.2; break;      // Sedentário
            case 2: activityFactor = 1.375; break;    // Levemente ativo
            case 3: activityFactor = 1.55; break;     // Moderadamente ativo
            case 4: activityFactor = 1.725; break;    // Muito ativo
            case 5: activityFactor = 1.9; break;      // Extremamente ativo
            default: activityFactor = 1.2;
        }

        return bmr * activityFactor;
    }
}
