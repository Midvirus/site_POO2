import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, TrendingDown, CalendarDays } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface WeightData {
  id: number;
  date: string;
  weight: number;
}

// Interface para o dado processado do gráfico (Média Mensal)
interface MonthlyData {
  name: string;   // "Jan", "Fev"
  fullDate: string; 
  averageWeight: number; 
  count: number; 
}

const WeightHistory = () => {
  const [rawData, setRawData] = useState<WeightData[]>([]);
  const [chartData, setChartData] = useState<MonthlyData[]>([]);
  const [newWeight, setNewWeight] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Busca dados do Backend
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/weights");
      if (response.ok) {
        const result = await response.json();
        setRawData(result);
        processMonthlyData(result);
      }
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- LÓGICA DE AGRUPAMENTO MENSAL ---
  const processMonthlyData = (data: WeightData[]) => {
    const currentYear = new Date().getFullYear();
    const monthsMap = new Map<number, { sum: number, count: number }>();

    // 1. Agrupa os pesos por mês
    data.forEach(entry => {
      const date = new Date(entry.date);
      // Filtra apenas dados deste ano
      if (date.getFullYear() === currentYear) {
        const monthIndex = date.getMonth(); // 0 = Jan, 1 = Fev...
        
        const current = monthsMap.get(monthIndex) || { sum: 0, count: 0 };
        monthsMap.set(monthIndex, {
          sum: current.sum + entry.weight,
          count: current.count + 1
        });
      }
    });

    // 2. Cria o array final com os 12 meses
    const mesesNomes = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    
    const processed: MonthlyData[] = mesesNomes.map((nome, index) => {
        const dataMes = monthsMap.get(index);
        return {
            name: nome,
            fullDate: `${currentYear}-${index + 1}`,
            // Se tiver dados, calcula média. Se não, 0.
            averageWeight: dataMes ? Number((dataMes.sum / dataMes.count).toFixed(1)) : 0,
            count: dataMes ? dataMes.count : 0
        };
    });

    // Remove meses futuros ou sem dados para o gráfico não cair a zero
    const finalData = processed.filter(d => d.averageWeight > 0);
    
    setChartData(finalData);
  };

  const handleAddWeight = async () => {
    if (!newWeight) return;
    try {
      const response = await fetch("http://localhost:8080/api/weights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            weight: parseFloat(newWeight),
            date: new Date().toISOString().split('T')[0] // Data de hoje
        })
      });

      if (response.ok) {
        toast({ title: "Sucesso", description: "Peso registrado!" });
        setNewWeight("");
        setIsModalOpen(false);
        fetchData(); // Recarrega o gráfico
      }
    } catch (error) {
        toast({ title: "Erro", description: "Falha ao salvar.", variant: "destructive" });
    }
  };

  // Cálculos de Resumo
  const currentWeight = rawData.length > 0 ? rawData[rawData.length - 1].weight : 0;
  const startWeight = rawData.length > 0 ? rawData[0].weight : 0;
  const totalChange = currentWeight - startWeight; 

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
                <CalendarDays className="h-5 w-5 text-primary"/>
                <div>
                    <CardTitle>Evolução Anual ({new Date().getFullYear()})</CardTitle>
                    <CardDescription>Média de peso por mês</CardDescription>
                </div>
            </div>
            
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                    <Button size="sm"><Plus className="h-4 w-4 mr-2"/> Registrar</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Registrar Peso</DialogTitle>
                        <DialogDescription>Digite seu peso atual (kg)</DialogDescription>
                    </DialogHeader>
                    <div className="flex gap-2 mt-4">
                        <Input 
                            type="number" 
                            placeholder="Ex: 80.5" 
                            value={newWeight}
                            onChange={(e) => setNewWeight(e.target.value)}
                        />
                        <Button onClick={handleAddWeight}>Salvar</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {/* GRÁFICO */}
        <div className="h-[250px] w-full mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                domain={['dataMin - 2', 'dataMax + 2']} 
                hide 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value: number) => [`${value} kg`, "Média"]}
                labelStyle={{ color: '#666' }}
              />
              <Line 
                type="monotone" 
                dataKey="averageWeight" 
                stroke="#2563eb" 
                strokeWidth={3}
                dot={{ r: 4, fill: "#2563eb", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* RESUMO NO RODAPÉ */}
        <div className="flex justify-between items-center text-sm pt-4 border-t">
            <div>
                <p className="text-muted-foreground">Peso Atual</p>
                <p className="text-2xl font-bold">{currentWeight} kg</p>
            </div>
            
            <div className="text-right">
                <p className="text-muted-foreground">Evolução no Ano</p>
                <div className={`flex items-center font-bold text-lg ${totalChange <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {totalChange <= 0 ? <TrendingDown className="h-4 w-4 mr-1"/> : '+'}
                    {totalChange.toFixed(1)} kg
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeightHistory;
