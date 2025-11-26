import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingUp, Flame, Activity, Loader2 } from "lucide-react";
import { useDashboard } from "@/contexts/DashboardContext";

const Reports = () => {
  const { getTotalCaloriasConsumed, getTotalCaloriasSpent, tmb } = useDashboard();
  
  // Estados para dados do Backend
  const [projection, setProjection] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Calcula valores de HOJE baseados no contexto (memória local do app)
  const consumed = getTotalCaloriasConsumed();
  const spent = getTotalCaloriasSpent();
  
  // Cálculos visuais
  const deficit = spent - consumed;
  // Evita divisão por zero e limita a barra em 100%
  const percentConsumed = spent > 0 ? Math.min((consumed / spent) * 100, 100) : 0;

  // Busca a projeção inteligente do Java
  useEffect(() => {
    const fetchProjection = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/reports/projection");
        if (response.ok) {
          const data = await response.json();
          setProjection(data);
        }
      } catch (error) {
        console.error("Erro ao carregar relatórios", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjection();
  }, []);

  if (loading) {
    return (
        <Card className="h-[300px] flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" />
        </Card>
    );
  }

  // Fallback se a API falhar
  const data = projection || {
    status: "CALCULANDO...",
    mediaConsumo7dias: 0,
    mediaGasto7dias: 0,
    tendencia: "Defina uma meta para ver sua projeção.",
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <CardTitle>Relatórios</CardTitle>
        </div>
        <CardDescription>Resumo diário e projeção baseada na sua meta</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* --- SEÇÃO 1: RESUMO DO DIA (Realtime) --- */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              Hoje
            </h4>
            <Badge variant={deficit >= 0 ? "default" : "destructive"}>
              {deficit >= 0 ? "Déficit" : "Superávit"}: {Math.abs(deficit)} kcal
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Consumido</span>
              <span className="font-semibold text-secondary">{consumed} kcal</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Gasto Total</span>
              <span className="font-semibold text-primary">{spent} kcal</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>└ TMB (Basal Estimada)</span>
              <span>{tmb} kcal</span>
            </div>
          </div>

          <div className="space-y-1">
            <Progress value={percentConsumed} className="h-2" />
            <p className="text-xs text-center text-muted-foreground">
                {percentConsumed.toFixed(0)}% da meta de gasto atingida
            </p>
          </div>
        </div>

        {/* --- SEÇÃO 2: PROJEÇÃO SEMANAL (Vinda do Java) --- */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Projeção
            </h4>
            <Badge 
              variant="outline"
              className="flex items-center gap-1 border-primary text-primary"
            >
              <Activity className="h-3 w-3" />
              {data.status}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Meta de Consumo</span>
              <span className="font-medium">{data.mediaConsumo7dias} kcal/dia</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Gasto Estimado</span>
              <span className="font-medium">{data.mediaGasto7dias} kcal/dia</span>
            </div>
          </div>

          <div className="p-3 bg-accent/20 rounded-lg border border-accent/50">
            <p className="text-xs text-center italic text-muted-foreground">
                "{data.tendencia}"
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Reports;
