import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Apple, Plus, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const MealManager = () => {
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);

  // Dados mockados - conectar com GET /api/refeicoes/today
  const refeicoes = [
    { tipo: "Café da Manhã", totalCalorias: 450, comidas: 3 },
    { tipo: "Almoço", totalCalorias: 650, comidas: 4 },
    { tipo: "Jantar", totalCalorias: 0, comidas: 0 },
    { tipo: "Lanche", totalCalorias: 200, comidas: 2 },
  ];

  // Lista de alimentos - conectar com GET /api/refeicoes/comidas
  const todosAlimentos = [
    { id: "1", nome: "Arroz Integral", calorias: 130, proteinas: 2.7, carbs: 28, gords: 1 },
    { id: "2", nome: "Frango Grelhado", calorias: 165, proteinas: 31, carbs: 0, gords: 3.6 },
    { id: "3", nome: "Batata Doce", calorias: 86, proteinas: 1.6, carbs: 20, gords: 0.1 },
    { id: "4", nome: "Ovo Cozido", calorias: 78, proteinas: 6.3, carbs: 0.6, gords: 5.3 },
    { id: "5", nome: "Banana", calorias: 105, proteinas: 1.3, carbs: 27, gords: 0.4 },
    { id: "6", nome: "Aveia", calorias: 68, proteinas: 2.4, carbs: 12, gords: 1.4 },
  ];

  const alimentosFiltrados = todosAlimentos.filter(a => 
    a.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddFoods = () => {
    // Conectar com POST /api/refeicoes/add-comida
    toast({
      title: "Alimentos adicionados!",
      description: `${selectedFoods.length} alimento(s) adicionado(s) à refeição.`,
    });
    setSelectedMeal(null);
    setSelectedFoods([]);
    setSearchTerm("");
  };

  const toggleFood = (foodId: string) => {
    setSelectedFoods(prev => 
      prev.includes(foodId) 
        ? prev.filter(id => id !== foodId)
        : [...prev, foodId]
    );
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Apple className="h-5 w-5 text-secondary" />
            <CardTitle>Alimentação do Dia</CardTitle>
          </div>
          <CardDescription>Gerencie suas refeições</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {refeicoes.map((ref, idx) => (
            <div
              key={idx}
              className="p-4 border rounded-lg hover:border-secondary transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{ref.tipo}</h4>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => setSelectedMeal(ref.tipo)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar
                </Button>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{ref.comidas} alimento(s)</span>
                <span className="font-medium text-secondary">{ref.totalCalorias} kcal</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Modal de Adicionar Alimentos */}
      <Dialog open={selectedMeal !== null} onOpenChange={() => setSelectedMeal(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Adicionar Alimentos - {selectedMeal}</DialogTitle>
            <DialogDescription>
              Selecione os alimentos para adicionar à refeição
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar alimentos..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {alimentosFiltrados.map((alimento) => (
                <div
                  key={alimento.id}
                  className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() => toggleFood(alimento.id)}
                >
                  <Checkbox
                    checked={selectedFoods.includes(alimento.id)}
                    onCheckedChange={() => toggleFood(alimento.id)}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{alimento.nome}</h4>
                    <div className="grid grid-cols-4 gap-2 mt-1 text-xs text-muted-foreground">
                      <span>{alimento.calorias} kcal</span>
                      <span>{alimento.proteinas}g prot</span>
                      <span>{alimento.carbs}g carb</span>
                      <span>{alimento.gords}g gord</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-sm text-muted-foreground">
                {selectedFoods.length} alimento(s) selecionado(s)
              </span>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSelectedMeal(null)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddFoods} disabled={selectedFoods.length === 0}>
                  Adicionar
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MealManager;
