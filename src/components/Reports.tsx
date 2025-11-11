import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingUp, Flame, Activity } from "lucide-react";

const Reports = () => {
  // Dados mockados - conectar com GET /api/reports/calories-summary
  const caloriesSummary = {
    consumed: 1300,
    spent: 2200,
    basal: 1800,
  };

  // Conectar com GET /api/reports/projection
  const projection = {
    status: "ALINHADO",
    mediaConsumo7dias: 1450,
    mediaGasto7dias: 2100,
    tendencia: "Em linha com seu objetivo de perder peso",
  };

  const deficit = caloriesSummary.spent - caloriesSummary.consumed;
  const percentConsumed = (caloriesSummary.consumed / caloriesSummary.spent) * 100;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <CardTitle>Relatórios</CardTitle>
        </div>
        <CardDescription>Resumo e projeção do seu progresso</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Resumo de Calorias */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              Resumo do Dia
            </h4>
            <Badge variant={deficit > 0 ? "default" : "destructive"}>
              {deficit > 0 ? "Déficit" : "Superávit"}: {Math.abs(deficit)} kcal
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Calorias Consumidas</span>
              <span className="font-semibold text-secondary">{caloriesSummary.consumed} kcal</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Calorias Gastas</span>
              <span className="font-semibold text-primary">{caloriesSummary.spent} kcal</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>└ TMB (Basal)</span>
              <span>{caloriesSummary.basal} kcal</span>
            </div>
          </div>

          <Progress value={percentConsumed} className="h-2" />
          <p className="text-xs text-center text-muted-foreground">
            {percentConsumed.toFixed(0)}% das calorias gastas foram consumidas
          </p>
        </div>

        {/* Projeção */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Projeção (7 dias)
            </h4>
            <Badge 
              variant={projection.status === "ALINHADO" ? "default" : "secondary"}
              className="flex items-center gap-1"
            >
              <Activity className="h-3 w-3" />
              {projection.status}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Média de Consumo</span>
              <span className="font-medium">{projection.mediaConsumo7dias} kcal/dia</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Média de Gasto</span>
              <span className="font-medium">{projection.mediaGasto7dias} kcal/dia</span>
            </div>
          </div>

          <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-sm text-center">{projection.tendencia}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Reports;
