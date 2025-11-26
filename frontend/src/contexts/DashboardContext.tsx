import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface Food {
  id: string | number;
  nome: string;
  calorias: number;
  [key: string]: any;
}

interface Exercise {
  id: string | number;
  name: string;
  type: string;
  sets?: number;
  reps?: number;
  duration?: number;
  totalCalorias?: number; // Para compatibilidade
  calories?: number;      // Para compatibilidade
  [key: string]: any;
}

interface DashboardContextType {
  exercicios: Exercise[];
  alimentos: Food[];
  tmb: number;
  addExercicios: (items: Exercise[]) => void;
  removeExercicio: (id: number | string) => void; // <--- NOVA FUNÇÃO
  addAlimentos: (items: Food[]) => void;
  removeAlimento: (id: number | string) => void;  // <--- NOVA FUNÇÃO
  getTotalCaloriasConsumed: () => number;
  getTotalCaloriasSpent: () => number;
}

const DashboardContext = createContext<DashboardContextType>({} as DashboardContextType);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  // Inicializa buscando do LocalStorage se existir, senão array vazio
  const [alimentos, setAlimentos] = useState<Food[]>(() => {
    const saved = localStorage.getItem("dashboard_alimentos");
    return saved ? JSON.parse(saved) : [];
  });

  const [exercicios, setExercicios] = useState<Exercise[]>(() => {
    const saved = localStorage.getItem("dashboard_exercicios");
    return saved ? JSON.parse(saved) : [];
  });

  const [tmb, setTmb] = useState(1800);

  // --- EFEITOS PARA SALVAR NO LOCALSTORAGE (Persistência no F5) ---
  useEffect(() => {
    localStorage.setItem("dashboard_alimentos", JSON.stringify(alimentos));
  }, [alimentos]);

  useEffect(() => {
    localStorage.setItem("dashboard_exercicios", JSON.stringify(exercicios));
  }, [exercicios]);


  // --- FUNÇÕES DE ADICIONAR ---
  const addExercicios = (items: Exercise[]) => {
    setExercicios((prev) => [...prev, ...items]);
  };

  const addAlimentos = (items: Food[]) => {
    setAlimentos((prev) => [...prev, ...items]);
  };

  // --- FUNÇÕES DE REMOVER (Correção do Bug) ---
  const removeExercicio = (id: number | string) => {
    setExercicios((prev) => prev.filter((item) => item.id !== id));
  };

  const removeAlimento = (id: number | string) => {
    setAlimentos((prev) => prev.filter((item) => item.id !== id));
  };

  // --- CÁLCULOS ---
  const getTotalCaloriasConsumed = () => {
    return alimentos.reduce((total, item) => {
      const cal = Number(item.calorias) || Number(item.calories) || 0;
      return total + cal;
    }, 0);
  };

  const getTotalCaloriasSpent = () => {
    const caloriasExercicios = exercicios.reduce((total, ex) => {
      // Tenta pegar o valor pronto de vários campos possíveis
      let cal = Number(ex.totalCalorias) || Number(ex.calories);

      // Se não tiver (NaN ou 0), calcula estimativa
      if (!cal) {
        if (ex.type === 'ANAEROBIC' || ex.tipo === 'ANAEROBIC') {
            const sets = Number(ex.sets) || 3;
            cal = sets * 15; 
        } else {
            const duration = Number(ex.duration) || 20;
            cal = duration * 8;
        }
      }
      return total + (cal || 0);
    }, 0);

    return tmb + caloriasExercicios;
  };

  return (
    <DashboardContext.Provider value={{
      exercicios,
      alimentos,
      tmb,
      addExercicios,
      removeExercicio, // Exportando a função nova
      addAlimentos,
      removeAlimento,  // Exportando a função nova
      getTotalCaloriasConsumed,
      getTotalCaloriasSpent,
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);
