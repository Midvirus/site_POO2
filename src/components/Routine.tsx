import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Dumbbell, Utensils, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useDashboard } from "@/contexts/DashboardContext";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Routine = () => {
  const { toast } = useToast();
  const { addExercicios } = useDashboard();
  const [showExercicioModal, setShowExercicioModal] = useState(false);
  const [searchExercicio, setSearchExercicio] = useState("");
  const [selectedExercicios, setSelectedExercicios] = useState<string[]>([]);
  
  const [showRefeicaoModal, setShowRefeicaoModal] = useState(false);
  const [novaRefeicao, setNovaRefeicao] = useState({
    tipo: "",
    horario: "",
  });

  // Dados mockados - conectar com GET /api/rotinas
  const [rotina, setRotina] = useState({
    diaSem: "Segunda-feira",
    treinos: [
      {
        id: "1",
        nome: "Treino de Peito",
        exercicios: [
          { id: "1", nome: "Supino Reto", grupoMusc: "Peitoral", totalCalorias: 150, totalProteinas: 0 },
          { id: "2", nome: "Crucifixo", grupoMusc: "Peitoral", totalCalorias: 120, totalProteinas: 0 },
        ]
      }
    ],
    refeicoes: [
      { tipo: "Café da Manhã", totalCalorias: 450 },
      { tipo: "Almoço", totalCalorias: 650 },
    ]
  });

  // Lista de exercícios disponíveis - conectar com GET /api/exercicios
  const exerciciosDisponiveis = [
    { id: "1", nome: "Supino Reto", categoria: "Peito", grupoMusc: "Peitoral", totalCalorias: 150, totalProteinas: 0 },
    { id: "2", nome: "Crucifixo", categoria: "Peito", grupoMusc: "Peitoral", totalCalorias: 120, totalProteinas: 0 },
    { id: "3", nome: "Agachamento", categoria: "Pernas", grupoMusc: "Quadríceps", totalCalorias: 200, totalProteinas: 0 },
    { id: "4", nome: "Leg Press", categoria: "Pernas", grupoMusc: "Quadríceps", totalCalorias: 180, totalProteinas: 0 },
    { id: "5", nome: "Rosca Direta", categoria: "Braços", grupoMusc: "Bíceps", totalCalorias: 100, totalProteinas: 0 },
    { id: "6", nome: "Tríceps Pulley", categoria: "Braços", grupoMusc: "Tríceps", totalCalorias: 110, totalProteinas: 0 },
    { id: "7", nome: "Puxada Frontal", categoria: "Costas", grupoMusc: "Dorsal", totalCalorias: 140, totalProteinas: 0 },
    { id: "8", nome: "Remada Curvada", categoria: "Costas", grupoMusc: "Dorsal", totalCalorias: 160, totalProteinas: 0 },
    { id: "9", nome: "Desenvolvimento", categoria: "Ombros", grupoMusc: "Deltoides", totalCalorias: 130, totalProteinas: 0 },
    { id: "10", nome: "Elevação Lateral", categoria: "Ombros", grupoMusc: "Deltoides", totalCalorias: 90, totalProteinas: 0 },
  ];

  const exerciciosFiltrados = exerciciosDisponiveis.filter(ex =>
    ex.nome.toLowerCase().includes(searchExercicio.toLowerCase()) ||
    ex.categoria.toLowerCase().includes(searchExercicio.toLowerCase()) ||
    ex.grupoMusc.toLowerCase().includes(searchExercicio.toLowerCase())
  );

  const handleToggleExercicio = (id: string) => {
    setSelectedExercicios(prev =>
      prev.includes(id) ? prev.filter(exId => exId !== id) : [...prev, id]
    );
  };

  const handleAdicionarExercicios = () => {
    // POST /api/rotinas/add-treino com exercícios selecionados
    const novosExercicios = exerciciosDisponiveis.filter(ex => selectedExercicios.includes(ex.id));
    
    setRotina(prev => ({
      ...prev,
      treinos: prev.treinos.map((treino, idx) => 
        idx === 0 ? { ...treino, exercicios: [...treino.exercicios, ...novosExercicios] } : treino
      )
    }));

    // Adiciona ao contexto para cálculo de calorias
    addExercicios(novosExercicios);

    toast({
      title: "Exercícios adicionados!",
      description: `${novosExercicios.length} exercício(s) adicionado(s) ao treino.`,
    });

    setSelectedExercicios([]);
    setShowExercicioModal(false);
    setSearchExercicio("");
  };

  const handleAdicionarRefeicao = () => {
    if (!novaRefeicao.tipo || !novaRefeicao.horario) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    // POST /api/rotinas/add-refeicao
    setRotina(prev => ({
      ...prev,
      refeicoes: [...prev.refeicoes, { tipo: novaRefeicao.tipo, totalCalorias: 0 }]
    }));

    toast({
      title: "Refeição adicionada!",
      description: `${novaRefeicao.tipo} adicionada à rotina.`,
    });

    setNovaRefeicao({ tipo: "", horario: "" });
    setShowRefeicaoModal(false);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <CardTitle>Rotina de Hoje</CardTitle>
          </div>
          <Badge variant="outline">{rotina.diaSem}</Badge>
        </div>
        <CardDescription>Seus treinos e refeições planejadas</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Treinos */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Dumbbell className="h-4 w-4 text-primary" />
            <span>Treinos</span>
          </div>
          {rotina.treinos.map((treino) => (
            <div key={treino.id} className="pl-6 space-y-2">
              <p className="font-medium">{treino.nome}</p>
              {treino.exercicios.map((ex, idx) => (
                <div key={idx} className="flex justify-between text-sm text-muted-foreground">
                  <span>• {ex.nome} ({ex.grupoMusc})</span>
                  <span className="text-primary">{ex.totalCalorias} kcal</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Refeições */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Utensils className="h-4 w-4 text-secondary" />
            <span>Refeições</span>
          </div>
          {rotina.refeicoes.map((ref, idx) => (
            <div key={idx} className="pl-6 flex justify-between text-sm">
              <span>• {ref.tipo}</span>
              <span className="text-secondary font-medium">{ref.totalCalorias} kcal</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => setShowExercicioModal(true)}
          >
            + Adicionar Exercício
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => setShowRefeicaoModal(true)}
          >
            + Adicionar Refeição
          </Button>
        </div>
      </CardContent>

      {/* Modal de Adicionar Exercícios */}
      <Dialog open={showExercicioModal} onOpenChange={setShowExercicioModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Adicionar Exercícios ao Treino</DialogTitle>
            <DialogDescription>
              Selecione os exercícios que deseja adicionar ao seu treino de hoje
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 flex-1 min-h-0">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar exercícios por nome, categoria ou grupo muscular..."
                value={searchExercicio}
                onChange={(e) => setSearchExercicio(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-2 overflow-y-auto flex-1 pr-2">
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
                    <p className="font-medium">{exercicio.nome}</p>
                    <div className="flex gap-2 text-sm text-muted-foreground mt-1">
                      <Badge variant="outline" className="text-xs">
                        {exercicio.categoria}
                      </Badge>
                      <span>•</span>
                      <span>{exercicio.grupoMusc}</span>
                      <span>•</span>
                      <span className="text-primary font-medium">{exercicio.totalCalorias} kcal</span>
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
              Adicionar ({selectedExercicios.length})
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Adicionar Refeição */}
      <Dialog open={showRefeicaoModal} onOpenChange={setShowRefeicaoModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Nova Refeição</DialogTitle>
            <DialogDescription>
              Defina o tipo e horário da refeição
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Refeição</Label>
              <Select value={novaRefeicao.tipo} onValueChange={(value) => setNovaRefeicao(prev => ({ ...prev, tipo: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Café da Manhã">Café da Manhã</SelectItem>
                  <SelectItem value="Lanche da Manhã">Lanche da Manhã</SelectItem>
                  <SelectItem value="Almoço">Almoço</SelectItem>
                  <SelectItem value="Lanche da Tarde">Lanche da Tarde</SelectItem>
                  <SelectItem value="Jantar">Jantar</SelectItem>
                  <SelectItem value="Ceia">Ceia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="horario">Horário</Label>
              <Input
                id="horario"
                type="time"
                value={novaRefeicao.horario}
                onChange={(e) => setNovaRefeicao(prev => ({ ...prev, horario: e.target.value }))}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowRefeicaoModal(false)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleAdicionarRefeicao} className="flex-1">
                Adicionar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default Routine;
