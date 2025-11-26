import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Dumbbell, Search, Trash2, Loader2 } from "lucide-react"; // <--- Importei Trash2
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useDashboard } from "@/contexts/DashboardContext";

// ... (Interfaces mantêm igual) ...
interface Exercise {
  id: number;
  name: string;
  muscleGroup: string;
  type: string;
  sets?: number;
  reps?: number;
  duration?: number;
}
// ... (Outras interfaces) ...

const Routine = () => {
  // ... (Estados mantêm igual) ...
  const { toast } = useToast();
  const { addExercicios } = useDashboard(); // (Se estiver usando contexto)
  const [rotina, setRotina] = useState<any>(null);
  const [bibliotecaExercicios, setBibliotecaExercicios] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [showExercicioModal, setShowExercicioModal] = useState(false);
  const [activeWorkoutId, setActiveWorkoutId] = useState<number | null>(null);
  const [searchExercicio, setSearchExercicio] = useState("");
  const [selectedExercicios, setSelectedExercicios] = useState<number[]>([]);

  // ... (fetchRoutineAndLibrary mantém igual) ...
  const fetchRoutineAndLibrary = async () => {
      // (Seu código de busca aqui...)
      // Vou resumir para focar na mudança:
      try {
        const routineRes = await fetch("http://localhost:8080/api/routines");
        const routineData = await routineRes.json();
        if (routineData.length > 0) setRotina(routineData[0]);

        const exercisesRes = await fetch("http://localhost:8080/api/exercises/templates");
        const exercisesData = await exercisesRes.json();
        setBibliotecaExercicios(exercisesData);
      } catch (error) { console.error(error); } 
      finally { setLoading(false); }
  };

  useEffect(() => { fetchRoutineAndLibrary(); }, []);

  // --- NOVA FUNÇÃO: REMOVER EXERCÍCIO ---
  const handleRemoveExercise = async (workoutId: number, exerciseId: number) => {
    // 1. Atualiza visualmente (Optimistic UI) para ser rápido
    if (rotina) {
        const novaRotina = { ...rotina };
        const treino = novaRotina.workouts.find((w: any) => w.id === workoutId);
        if (treino) {
            treino.exercises = treino.exercises.filter((ex: any) => ex.id !== exerciseId);
            setRotina(novaRotina);
        }
    }

    // 2. Manda deletar no Backend
    try {
        const response = await fetch(`http://localhost:8080/api/exercises/${exerciseId}`, {
            method: "DELETE",
        });

        if (response.ok) {
            toast({ title: "Removido", description: "Exercício removido do treino." });
        } else {
            toast({ title: "Erro", description: "Falha ao remover.", variant: "destructive" });
            fetchRoutineAndLibrary(); // Recarrega se deu erro para desfazer a mudança visual
        }
    } catch (error) {
        console.error("Erro ao deletar", error);
    }
  };

  // ... (handleAdicionarExercicios mantém igual) ...
  const handleAdicionarExercicios = async () => {
      // (Seu código de adicionar...)
      if (!rotina || activeWorkoutId === null) return;
      const novosExerciciosModelo = bibliotecaExercicios.filter(ex => selectedExercicios.includes(ex.id));
      const rotinaAtualizada = { ...rotina };
      const treinoAlvo = rotinaAtualizada.workouts.find((w: any) => w.id === activeWorkoutId);

      if (treinoAlvo) {
        // Criar objetos sem ID para o backend salvar como novos
        const novosParaAdicionar = novosExerciciosModelo.map(modelo => ({
            ...modelo,
            id: undefined, 
            workout: { id: activeWorkoutId }
        }));
        
        // Vamos usar o endpoint de salvar exercícios em lote ou salvar a rotina
        // Simplificação: Vamos salvar a rotina inteira como fizemos antes
        // Nota: Para funcionar 100% com o Cascade do Java, o ideal é adicionar na lista e salvar a Rotina.
        
        treinoAlvo.exercises = [...treinoAlvo.exercises, ...novosExerciciosModelo];
        setRotina(rotinaAtualizada);

        try {
            const response = await fetch("http://localhost:8080/api/routines", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(rotinaAtualizada)
            });
            if (response.ok) {
                toast({ title: "Sucesso", description: "Treino atualizado!" });
                fetchRoutineAndLibrary();
            }
        } catch (e) { console.error(e); }
      }
      setSelectedExercicios([]);
      setShowExercicioModal(false);
      setActiveWorkoutId(null);
  };

  // ... (Filtros e Modais mantêm igual) ...
  const exerciciosFiltrados = bibliotecaExercicios.filter(ex =>
    ex.name.toLowerCase().includes(searchExercicio.toLowerCase()) ||
    ex.muscleGroup.toLowerCase().includes(searchExercicio.toLowerCase())
  );
  
  const handleToggleExercicio = (id: number) => {
    setSelectedExercicios(prev => prev.includes(id) ? prev.filter(exId => exId !== id) : [...prev, id]);
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  if (!rotina) return <div className="text-center p-8">Nenhuma rotina.</div>;

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
        {rotina.workouts.map((treino: any) => (
            <div key={treino.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-semibold text-lg">{treino.name}</h3>
                        <p className="text-sm text-muted-foreground">{treino.description}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => { setActiveWorkoutId(treino.id); setShowExercicioModal(true); }}>
                        <Dumbbell className="h-4 w-4 mr-2" />
                        Adicionar
                    </Button>
                </div>

                <div className="pl-4 border-l-2 border-muted space-y-2">
                    {treino.exercises.length === 0 && (
                        <p className="text-sm text-muted-foreground italic">Nenhum exercício neste treino.</p>
                    )}
                    {treino.exercises.map((ex: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-sm bg-muted/30 p-2 rounded hover:bg-muted/50 transition-colors group">
                            <div className="flex flex-col">
                                <span className="font-medium">{ex.name}</span>
                                <div className="text-muted-foreground text-xs flex gap-2 mt-1">
                                    <Badge variant="secondary" className="text-[10px] h-4">{ex.muscleGroup}</Badge>
                                    {ex.type === 'ANAEROBIC' ? (
                                        <span>{ex.sets} séries x {ex.reps} reps</span>
                                    ) : (
                                        <span>{ex.duration} min</span>
                                    )}
                                </div>
                            </div>
                            
                            {/* BOTÃO DE REMOVER (Só aparece o ID existir, ou seja, já foi salvo) */}
                            {ex.id && (
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleRemoveExercise(treino.id, ex.id)}
                                    title="Remover exercício"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        ))}
      </CardContent>

      {/* ... (O Modal Dialog continua igualzinho estava antes) ... */}
      <Dialog open={showExercicioModal} onOpenChange={setShowExercicioModal}>
         <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
             <DialogHeader><DialogTitle>Biblioteca</DialogTitle></DialogHeader>
             <div className="flex flex-col gap-4 flex-1 min-h-0">
                 <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar..." value={searchExercicio} onChange={e => setSearchExercicio(e.target.value)} className="pl-10"/>
                 </div>
                 <div className="space-y-2 overflow-y-auto flex-1 pr-2 max-h-[400px]">
                    {exerciciosFiltrados.map(exercicio => (
                        <div key={exercicio.id} onClick={() => handleToggleExercicio(exercicio.id)} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent cursor-pointer">
                            <Checkbox checked={selectedExercicios.includes(exercicio.id)} />
                            <div className="flex-1">
                                <p className="font-medium">{exercicio.name}</p>
                                <span className="text-xs text-muted-foreground">{exercicio.muscleGroup}</span>
                            </div>
                        </div>
                    ))}
                 </div>
             </div>
             <div className="flex gap-2 pt-4 border-t">
                 <Button variant="outline" onClick={() => setShowExercicioModal(false)} className="flex-1">Cancelar</Button>
                 <Button onClick={handleAdicionarExercicios} disabled={selectedExercicios.length === 0} className="flex-1">Adicionar</Button>
             </div>
         </DialogContent>
      </Dialog>
    </Card>
  );
};

export default Routine;
