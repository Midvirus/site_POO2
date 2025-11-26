import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Dumbbell, Utensils, Search, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useDashboard } from "@/contexts/DashboardContext";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Tipagem dos dados vindos do Java
interface Exercise {
  id: number;
  name: string;
  muscleGroup: string;
  type: string;
  sets?: number;
  reps?: number;
  duration?: number;
}

interface Workout {
  id: number;
  name: string;
  description: string;
  exercises: Exercise[];
}

interface RoutineData {
  id: number;
  name: string;
  goal: string;
  workouts: Workout[];
}

const Routine = () => {
  const { toast } = useToast();
  const { addExercicios } = useDashboard();
  
  // Estados de Dados
  const [rotina, setRotina] = useState<RoutineData | null>(null);
  const [bibliotecaExercicios, setBibliotecaExercicios] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados de UI
  const [showExercicioModal, setShowExercicioModal] = useState(false);
  const [activeWorkoutId, setActiveWorkoutId] = useState<number | null>(null); // Qual treino estamos editando?
  const [searchExercicio, setSearchExercicio] = useState("");
  const [selectedExercicios, setSelectedExercicios] = useState<number[]>([]);

  // --- 1. BUSCAR DADOS INICIAIS ---
  const fetchRoutineAndLibrary = async () => {
    try {
      // Busca a primeira rotina (já que usuário não cria, pega a padrão)
      const routineRes = await fetch("http://localhost:8080/api/routines");
      const routineData = await routineRes.json();
      
      if (routineData.length > 0) {
        setRotina(routineData[0]); // Pega a primeira rotina encontrada
      }

      // Busca a biblioteca de exercícios (templates)
      const exercisesRes = await fetch("http://localhost:8080/api/exercises/templates");
      const exercisesData = await exercisesRes.json();
      setBibliotecaExercicios(exercisesData);

    } catch (error) {
      console.error("Erro ao carregar dados", error);
      toast({ title: "Erro", description: "Falha ao carregar rotina.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutineAndLibrary();
  }, []);


  // --- 2. SALVAR EXERCÍCIOS NO TREINO ---
  const handleAdicionarExercicios = async () => {
    if (!rotina || activeWorkoutId === null) return;

    // Encontra os objetos completos dos exercícios selecionados na biblioteca
    const novosExerciciosModelo = bibliotecaExercicios.filter(ex => selectedExercicios.includes(ex.id));
    
    // Atualiza o estado localmente primeiro (Optimistic UI)
    const rotinaAtualizada = { ...rotina };
    const treinoAlvo = rotinaAtualizada.workouts.find(w => w.id === activeWorkoutId);

    if (treinoAlvo) {
      // Adiciona os novos exercícios à lista existente do treino
      // Nota: No mundo real, deveríamos clonar o exercício no backend com novos IDs.
      // Aqui vamos mandar a rotina inteira para o backend atualizar.
      
      const novosParaAdicionar = novosExerciciosModelo.map(modelo => ({
        ...modelo,
        id: undefined, // Remove ID para o backend criar um novo registro vinculado ao treino
        workout: { id: activeWorkoutId } // Vincula ao treino
      }));

      // A gambiarra elegante: Atualizamos a rotina inteira via PUT/POST
      // Mas como a estrutura é complexa, vamos apenas atualizar o estado local e mandar salvar
      treinoAlvo.exercises = [...treinoAlvo.exercises, ...novosExerciciosModelo]; 
      setRotina(rotinaAtualizada);
      
      // Enviar para o Backend
      try {
        const response = await fetch("http://localhost:8080/api/routines", {
          method: "POST", // O Controller usa POST para salvar/atualizar
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(rotinaAtualizada)
        });

        if (response.ok) {
           toast({ title: "Sucesso", description: "Treino atualizado!" });
           fetchRoutineAndLibrary(); // Recarrega para pegar os IDs reais
        }
      } catch (error) {
        toast({ title: "Erro", description: "Falha ao salvar treino.", variant: "destructive" });
      }
    }

    addExercicios(novosExerciciosModelo); // Para o Dashboard
    setSelectedExercicios([]);
    setShowExercicioModal(false);
    setActiveWorkoutId(null);
  };

  // Filtragem da biblioteca no modal
  const exerciciosFiltrados = bibliotecaExercicios.filter(ex =>
    ex.name.toLowerCase().includes(searchExercicio.toLowerCase()) ||
    ex.muscleGroup.toLowerCase().includes(searchExercicio.toLowerCase())
  );

  const handleToggleExercicio = (id: number) => {
    setSelectedExercicios(prev =>
      prev.includes(id) ? prev.filter(exId => exId !== id) : [...prev, id]
    );
  };

  const openModalForWorkout = (workoutId: number) => {
      setActiveWorkoutId(workoutId);
      setShowExercicioModal(true);
  };

  if (loading) {
      return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  }

  if (!rotina) {
      return <div className="text-center p-8">Nenhuma rotina encontrada. Reinicie o servidor para gerar a padrão.</div>;
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <CardTitle>{rotina.name}</CardTitle>
          </div>
          <Badge variant="outline">{rotina.goal}</Badge>
        </div>
        <CardDescription>Gerencie seus treinos semanais</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Lista de Treinos (A, B, C...) */}
        {rotina.workouts.map((treino) => (
            <div key={treino.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-semibold text-lg">{treino.name}</h3>
                        <p className="text-sm text-muted-foreground">{treino.description}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => openModalForWorkout(treino.id)}>
                        <Dumbbell className="h-4 w-4 mr-2" />
                        Adicionar / Editar
                    </Button>
                </div>

                {/* Lista de Exercícios DENTRO do Treino */}
                <div className="pl-4 border-l-2 border-muted space-y-2">
                    {treino.exercises.length === 0 && (
                        <p className="text-sm text-muted-foreground italic">Nenhum exercício neste treino.</p>
                    )}
                    {treino.exercises.map((ex, idx) => (
                        <div key={idx} className="flex justify-between text-sm bg-muted/30 p-2 rounded">
                            <span className="font-medium">{ex.name}</span>
                            <div className="text-muted-foreground text-xs flex gap-3">
                                <Badge variant="secondary" className="text-[10px]">{ex.muscleGroup}</Badge>
                                {ex.type === 'ANAEROBIC' ? (
                                    <span>{ex.sets}x{ex.reps} • {ex.id ? 'Carga' : 'Modelo'}</span>
                                ) : (
                                    <span>{ex.duration} min</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ))}
      </CardContent>

      {/* Modal de Seleção de Exercícios (Biblioteca) */}
      <Dialog open={showExercicioModal} onOpenChange={setShowExercicioModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Biblioteca de Exercícios</DialogTitle>
            <DialogDescription>
              Selecione exercícios para adicionar ao treino.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 flex-1 min-h-0">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar (ex: Supino, Peito)..."
                value={searchExercicio}
                onChange={(e) => setSearchExercicio(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-2 overflow-y-auto flex-1 pr-2 max-h-[400px]">
              {exerciciosFiltrados.map((exercicio) => (
                <div
                  key={exercicio.id}
                  className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => handleToggleExercicio(exercicio.id)}
                >
                  <Checkbox
                    checked={selectedExercicios.includes(exercicio.id)}
                    onCheckedChange={() => handleToggleExercicio(exercicio.id)}
                  />
                  <div className="flex-1">
                    <p className="font-medium">{exercicio.name}</p>
                    <div className="flex gap-2 text-sm text-muted-foreground mt-1">
                      <Badge variant="outline" className="text-xs">
                        {exercicio.muscleGroup}
                      </Badge>
                      <span>•</span>
                      {exercicio.type === 'ANAEROBIC' ? (
                         <span>Séries: {exercicio.sets} | Reps: {exercicio.reps}</span>
                      ) : (
                         <span>Cardio</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowExercicioModal(false)} className="flex-1">
              Cancelar
            </Button>
            <Button 
              onClick={handleAdicionarExercicios}
              disabled={selectedExercicios.length === 0}
              className="flex-1"
            >
              Adicionar ao Treino ({selectedExercicios.length})
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default Routine;
