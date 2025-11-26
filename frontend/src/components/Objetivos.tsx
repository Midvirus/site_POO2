import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target, TrendingDown, Plus, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Interface alinhada com o Backend Java
interface Goal {
  id: number;
  focus: string; // O Backend manda 'focus', o front usava 'foco'. Vamos adaptar.
  startWeight: number;
  targetWeight: number;
  startDate: string;
  endDate: string;
  status: string;
}

const Objetivos = () => {
  const [selectedObjetivo, setSelectedObjetivo] = useState<Goal | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showNewObjetivo, setShowNewObjetivo] = useState(false);
  
  const [objetivos, setObjetivos] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado temporário para criar/editar
  const [formData, setFormData] = useState({
    focus: "Ganho de Massa", // Valor padrão seguro
    startWeight: "",
    targetWeight: "",
    startDate: "",
    endDate: "",
    status: "Ativo"
  });

  // --- 1. BUSCAR DO BACKEND ---
  const fetchGoals = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/goals");
      if (response.ok) {
        const data = await response.json();
        setObjetivos(data);
        
        // Verifica se tem algum ativo para atualizar a rotina globalmente
        const ativo = data.find((g: Goal) => g.status === "Ativo");
        if (ativo) {
            localStorage.setItem("userGoal", ativo.focus);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar metas", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  // --- 2. SALVAR (CRIAR OU EDITAR) ---
  const handleSave = async () => {
    if (!formData.startWeight || !formData.targetWeight || !formData.startDate || !formData.endDate) {
      toast({ title: "Erro", description: "Preencha todos os campos.", variant: "destructive" });
      return;
    }

    const payload = {
      focus: formData.focus,
      startWeight: parseFloat(formData.startWeight),
      targetWeight: parseFloat(formData.targetWeight),
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: formData.status
    };

    try {
      let response;
      if (isEditing && selectedObjetivo) {
        // PUT (Editar)
        response = await fetch(`http://localhost:8080/api/goals/${selectedObjetivo.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        // POST (Criar)
        response = await fetch("http://localhost:8080/api/goals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      if (response.ok) {
        toast({ title: "Sucesso!", description: "Meta salva com sucesso." });
        
        // Se a meta salva for "Ativa", atualiza a rotina do usuário
        if (payload.status === "Ativo") {
            localStorage.setItem("userGoal", payload.focus);
            toast({ title: "Rotina Atualizada", description: `Seus treinos mudaram para: ${payload.focus}` });
        }

        fetchGoals(); // Recarrega a lista
        closeModals();
      } else {
        toast({ title: "Erro", description: "Falha ao salvar.", variant: "destructive" });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const closeModals = () => {
    setShowNewObjetivo(false);
    setSelectedObjetivo(null);
    setIsEditing(false);
    // Reset form
    setFormData({
        focus: "Ganho de Massa",
        startWeight: "",
        targetWeight: "",
        startDate: "",
        endDate: "",
        status: "Ativo"
    });
  };

  const openEditModal = (obj: Goal) => {
    setSelectedObjetivo(obj);
    setFormData({
        focus: obj.focus,
        startWeight: obj.startWeight.toString(),
        targetWeight: obj.targetWeight.toString(),
        startDate: obj.startDate,
        endDate: obj.endDate,
        status: obj.status
    });
    // Abre o modal de detalhes, usuário clica em editar lá dentro se quiser
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <CardTitle>Metas e Objetivos</CardTitle>
          </div>
          <CardDescription>Defina sua meta principal para adaptar sua rotina</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {objetivos.length === 0 && <p className="text-center text-muted-foreground py-4">Nenhuma meta definida ainda.</p>}
          
          {objetivos.map((obj) => (
            <div
              key={obj.id}
              className={`p-4 border rounded-lg hover:border-primary cursor-pointer transition-colors ${obj.status === 'Ativo' ? 'bg-accent/5 border-primary/50' : ''}`}
              onClick={() => openEditModal(obj)}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold">{obj.focus}</h4>
                <Badge variant={obj.status === "Ativo" ? "default" : "secondary"}>
                  {obj.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingDown className="h-4 w-4" />
                <span>{obj.startWeight}kg → {obj.targetWeight}kg</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(obj.startDate).toLocaleDateString()} - {new Date(obj.endDate).toLocaleDateString()}
              </p>
            </div>
          ))}
          <Button className="w-full" variant="outline" onClick={() => setShowNewObjetivo(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Meta
          </Button>
        </CardContent>
      </Card>

      {/* MODAL (Serve tanto para Criar quanto para Ver/Editar) */}
      <Dialog 
        open={showNewObjetivo || selectedObjetivo !== null} 
        onOpenChange={closeModals}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {showNewObjetivo ? "Criar Nova Meta" : (isEditing ? "Editar Objetivo" : "Detalhes do Objetivo")}
            </DialogTitle>
            <DialogDescription>
              {showNewObjetivo || isEditing ? "Defina o foco para ajustar seus treinos." : "Visualize os detalhes da sua meta."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Modo Visualização (Apenas texto) */}
            {!showNewObjetivo && !isEditing && selectedObjetivo ? (
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-muted-foreground">Foco</Label>
                            <p className="font-medium">{selectedObjetivo.focus}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">Status</Label>
                            <Badge>{selectedObjetivo.status}</Badge>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">Peso Inicial</Label>
                            <p>{selectedObjetivo.startWeight} kg</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">Peso Meta</Label>
                            <p>{selectedObjetivo.targetWeight} kg</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">Início</Label>
                            <p>{selectedObjetivo.startDate}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">Fim</Label>
                            <p>{selectedObjetivo.endDate}</p>
                        </div>
                    </div>
                </div>
            ) : (
                /* Modo Edição/Criação (Formulário) */
                <>
                    <div className="space-y-2">
                        <Label htmlFor="foco">Foco Principal (Define sua Rotina)</Label>
                        <Select 
                            value={formData.focus} 
                            onValueChange={(val) => setFormData({...formData, focus: val})}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Ganho de Massa">Ganho de Massa (Hipertrofia)</SelectItem>
                                <SelectItem value="Perda de Peso">Perda de Peso (Definição)</SelectItem>
                                <SelectItem value="Cardiorespiratório">Cardio e Resistência</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Peso Inicial (kg)</Label>
                            <Input type="number" value={formData.startWeight} onChange={e => setFormData({...formData, startWeight: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label>Peso Meta (kg)</Label>
                            <Input type="number" value={formData.targetWeight} onChange={e => setFormData({...formData, targetWeight: e.target.value})} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Data Início</Label>
                            <Input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label>Data Fim</Label>
                            <Input type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Select 
                            value={formData.status} 
                            onValueChange={(val) => setFormData({...formData, status: val})}
                        >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Ativo">Ativo (Rotina Vigente)</SelectItem>
                                <SelectItem value="Pausado">Pausado</SelectItem>
                                <SelectItem value="Concluído">Concluído</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </>
            )}
          </div>

          <DialogFooter>
            {/* Botões Dinâmicos */}
            {!showNewObjetivo && !isEditing ? (
                <Button onClick={() => setIsEditing(true)}>Editar</Button>
            ) : (
                <div className="flex gap-2 w-full justify-end">
                    <Button variant="outline" onClick={closeModals}>Cancelar</Button>
                    <Button onClick={handleSave}>Salvar</Button>
                </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Objetivos;
