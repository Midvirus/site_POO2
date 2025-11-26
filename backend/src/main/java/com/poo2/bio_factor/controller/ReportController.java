package com.poo2.bio_factor.controller;

import com.poo2.bio_factor.model.Goal;
import com.poo2.bio_factor.model.WeightEntry;
import com.poo2.bio_factor.repository.GoalRepository;
import com.poo2.bio_factor.repository.WeightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private WeightRepository weightRepository;

    @GetMapping("/projection")
    public Map<String, Object> getProjection() {
        Map<String, Object> response = new HashMap<>();

        // 1. Busca a meta ativa
        List<Goal> activeGoals = goalRepository.findByStatus("Ativo");
        String foco = activeGoals.isEmpty() ? "Manutenção" : activeGoals.get(0).getFocus();

        // 2. Busca o peso atual para calcular TMB estimada
        List<WeightEntry> weights = weightRepository.findAllByOrderByDateAsc();
        double currentWeight = weights.isEmpty() ? 70.0 : weights.get(weights.size() - 1).getWeight();

        // 3. Cálculos Estimados (Projeção)
        // TMB média (fórmula simples) * Fator atividade moderado (1.55)
        int gastoDiarioEstimado = (int) (currentWeight * 22 * 1.55); 
        int consumoDiarioIdeal;
        String status;
        String tendencia;

        // Ajusta baseado no objetivo
        if (foco.contains("Perda")) {
            consumoDiarioIdeal = gastoDiarioEstimado - 500; // Déficit de 500kcal
            status = "ALINHADO"; // Assumindo que o usuário vai seguir a dieta
            tendencia = "Você deve perder aprox. 0.5kg por semana.";
        } else if (foco.contains("Massa")) {
            consumoDiarioIdeal = gastoDiarioEstimado + 300; // Superávit
            status = "EM CRESCIMENTO";
            tendencia = "Foco em progressão de carga e proteínas.";
        } else {
            consumoDiarioIdeal = gastoDiarioEstimado;
            status = "ESTÁVEL";
            tendencia = "Manutenção de peso e melhora cardiorrespiratória.";
        }

        // Monta o JSON de resposta
        response.put("status", status);
        response.put("mediaConsumo7dias", consumoDiarioIdeal);
        response.put("mediaGasto7dias", gastoDiarioEstimado);
        response.put("tendencia", tendencia);

        return response;
    }
}
