import { createContext, useContext, useState, ReactNode } from "react";
import { Exercicio, Comida } from "@/types";

interface DashboardContextType {
  exercicios: Exercicio[];
  alimentos: Comida[];
  tmb: number;
  addExercicios: (exercicios: Exercicio[]) => void;
  addAlimentos: (alimentos: Comida[]) => void;
  getTotalCaloriasConsumed: () => number;
  getTotalCaloriasSpent: () => number;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [exercicios, setExercicios] = useState<Exercicio[]>([]);
  const [alimentos, setAlimentos] = useState<Comida[]>([]);
  
  // TMB mockado (Idealmente viria do usuário)
  const tmb = 1800;

  const addExercicios = (novosExercicios: Exercicio[]) => {
    setExercicios(prev => [...prev, ...novosExercicios]);
  };

  const addAlimentos = (novosAlimentos: Comida[]) => {
    setAlimentos(prev => [...prev, ...novosAlimentos]);
  };

  // --- CORREÇÃO 1: Blindagem no Consumo ---
  const getTotalCaloriasConsumed = () => {
    return alimentos.reduce((total, alimento) => {
      // Garante que é número. Se for undefined/null, vira 0.
      const cal = Number(alimento.calorias) || 0;
      return total + cal;
    }, 0);
  };

  // --- CORREÇÃO 2: Blindagem no Gasto (A principal causa do NaN) ---
  const getTotalCaloriasSpent = () => {
    const caloriasExercicios = exercicios.reduce((total, ex: any) => {
      // 1. Tenta pegar o valor pronto
      let cal = Number(ex.totalCalorias);

      // 2. Se não existir (NaN ou 0), calcula uma estimativa agora
      if (!cal) {
        // Se for Anaeróbico (Musculação), usa Séries
        if (ex.type === 'ANAEROBIC' || ex.tipo === 'ANAEROBIC') {
            const sets = Number(ex.sets) || 3; // Padrão 3 séries
            cal = sets * 15; // Estima 15kcal por série
        } 
        // Se for Aeróbico (Cardio), usa Duração
        else {
            const duration = Number(ex.duration) || 20; // Padrão 20 min
            cal = duration * 8; // Estima 8kcal por minuto
        }
      }

      return total + (cal || 0);
    }, 0);

    return tmb + caloriasExercicios;
  };

  return (
    <DashboardContext.Provider
      value={{
        exercicios,
        alimentos,
        tmb,
        addExercicios,
        addAlimentos,
        getTotalCaloriasConsumed,
        getTotalCaloriasSpent,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return context;
};
