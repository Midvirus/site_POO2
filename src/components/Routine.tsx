import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Dumbbell, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";

const Routine = () => {
  // Dados mockados - conectar com GET /api/rotinas
  const rotina = {
    diaSem: "Segunda-feira",
    treinos: [
      {
        id: "1",
        nome: "Treino de Peito",
        exercicios: [
          { nome: "Supino Reto", grupoMusc: "Peitoral", totalCalorias: 150 },
          { nome: "Crucifixo", grupoMusc: "Peitoral", totalCalorias: 120 },
        ]
      }
    ],
    refeicoes: [
      { tipo: "Café da Manhã", totalCalorias: 450 },
      { tipo: "Almoço", totalCalorias: 650 },
    ]
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
          <Button variant="outline" size="sm" className="flex-1">
            + Adicionar Treino
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            + Adicionar Refeição
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Routine;
