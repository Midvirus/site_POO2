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
  
  // TMB mockado - deve vir do backend baseado no usuário
  const tmb = 1800;

  const addExercicios = (novosExercicios: Exercicio[]) => {
    setExercicios(prev => [...prev, ...novosExercicios]);
  };

  const addAlimentos = (novosAlimentos: Comida[]) => {
    setAlimentos(prev => [...prev, ...novosAlimentos]);
  };

  const getTotalCaloriasConsumed = () => {
    return alimentos.reduce((total, alimento) => total + alimento.calorias, 0);
  };

  const getTotalCaloriasSpent = () => {
    const caloriasExercicios = exercicios.reduce((total, ex) => total + ex.totalCalorias, 0);
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
