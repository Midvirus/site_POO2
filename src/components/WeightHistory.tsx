import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp, Scale } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const WeightHistory = () => {
  // Dados mockados - últimos 7 dias
  const weightData = [
    { dia: "Seg", peso: 78.5, meta: 75 },
    { dia: "Ter", peso: 78.2, meta: 75 },
    { dia: "Qua", peso: 78.0, meta: 75 },
    { dia: "Qui", peso: 77.8, meta: 75 },
    { dia: "Sex", peso: 77.5, meta: 75 },
    { dia: "Sáb", peso: 77.3, meta: 75 },
    { dia: "Dom", peso: 77.0, meta: 75 },
  ];

  const pesoInicial = weightData[0].peso;
  const pesoAtual = weightData[weightData.length - 1].peso;
  const diferenca = pesoAtual - pesoInicial;
  const percentual = ((diferenca / pesoInicial) * 100).toFixed(1);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-primary" />
          <CardTitle>Histórico de Peso</CardTitle>
        </div>
        <CardDescription>Evolução semanal do seu peso</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Peso Inicial</p>
            <p className="text-lg font-semibold">{pesoInicial} kg</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Peso Atual</p>
            <p className="text-lg font-semibold text-primary">{pesoAtual} kg</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Variação</p>
            <div className="flex items-center gap-1">
              {diferenca < 0 ? (
                <TrendingDown className="h-4 w-4 text-primary" />
              ) : (
                <TrendingUp className="h-4 w-4 text-destructive" />
              )}
              <p className={`text-lg font-semibold ${diferenca < 0 ? 'text-primary' : 'text-destructive'}`}>
                {diferenca > 0 ? '+' : ''}{diferenca.toFixed(1)} kg
              </p>
            </div>
            <p className="text-xs text-muted-foreground">({percentual}%)</p>
          </div>
        </div>

        {/* Gráfico */}
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weightData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="dia" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                domain={[70, 80]}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  color: "hsl(var(--card-foreground))",
                }}
                labelStyle={{ color: "hsl(var(--muted-foreground))" }}
              />
              <Line 
                type="monotone" 
                dataKey="peso" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))", r: 4 }}
                activeDot={{ r: 6 }}
                name="Peso (kg)"
              />
              <Line 
                type="monotone" 
                dataKey="meta" 
                stroke="hsl(var(--secondary))" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Meta (kg)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Legenda */}
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-primary" />
            <span className="text-muted-foreground">Peso Atual</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-secondary" style={{ borderTop: "2px dashed" }} />
            <span className="text-muted-foreground">Meta</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeightHistory;
