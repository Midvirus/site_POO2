import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Importante para o formulário
import { Apple, Plus, Search, X, Save, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useDashboard } from "@/contexts/DashboardContext";
import { Badge } from "@/components/ui/badge";

interface FoodBackend {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  quantity: number;
}

const MealManager = () => {
  const { addAlimentos } = useDashboard();
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [showAlimentosModal, setShowAlimentosModal] = useState(false);
  const [todosAlimentos, setTodosAlimentos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Controle do Modo de Criação
  const [isCreating, setIsCreating] = useState(false);
  const [newFoodData, setNewFoodData] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: ""
  });

  const [refeicoes, setRefeicoes] = useState([
    { tipo: "Café da Manhã", totalCalorias: 0, comidas: [] as any[] },
    { tipo: "Almoço", totalCalorias: 0, comidas: [] as any[] },
    { tipo: "Jantar", totalCalorias: 0, comidas: [] as any[] },
    { tipo: "Lanche", totalCalorias: 0, comidas: [] as any[] },
  ]);

  const fetchFoods = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/foods");
      if (response.ok) {
        const data: FoodBackend[] = await response.json();
        const alimentosFormatados = data.map(item => ({
          id: item.id.toString(),
          nome: item.name,
          calorias: item.calories,
          proteinas: item.protein,
          carbs: item.carbs,
          gords: item.fats
        }));
        setTodosAlimentos(alimentosFormatados);
      }
    } catch (error) {
      console.error("Erro ao buscar alimentos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  // --- Lógica para Criar Comida Detalhada ---
  const handleSaveNewFood = async () => {
    if (!newFoodData.name || !newFoodData.calories) {
        toast({ title: "Erro", description: "Nome e Calorias são obrigatórios", variant: "destructive" });
        return;
    }

    const payload = {
      name: newFoodData.name,
      calories: parseInt(newFoodData.calories) || 0,
      protein: parseInt(newFoodData.protein) || 0,
      carbs: parseInt(newFoodData.carbs) || 0,
      fats: parseInt(newFoodData.fats) || 0,
      quantity: 100 // Padrão 100g/unidade
    };

    try {
      const response = await fetch("http://localhost:8080/api/foods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast({ title: "Sucesso!", description: `Alimento "${payload.name}" salvo!` });
        await fetchFoods();
        setIsCreating(false); // Volta para a lista
        setNewFoodData({ name: "", calories: "", protein: "", carbs: "", fats: "" }); // Limpa form
      } else {
        toast({ title: "Erro", description: "Falha ao salvar.", variant: "destructive" });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddFoods = () => {
    const novosAlimentos = todosAlimentos.filter(a => selectedFoods.includes(a.id));
    
    setRefeicoes(prev => prev.map(ref => 
      ref.tipo === selectedMeal 
        ? { 
            ...ref, 
            comidas: [...ref.comidas, ...novosAlimentos],
            totalCalorias: ref.totalCalorias + novosAlimentos.reduce((sum, a) => sum + a.calorias, 0)
          }
        : ref
    ));

    addAlimentos(novosAlimentos);
    toast({ title: "Adicionado", description: "Alimentos inseridos na refeição." });
    
    setSelectedMeal(null);
    setSelectedFoods([]);
  };

  const handleRemoveFood = (refeicaoTipo: string, alimentoId: string) => {
    setRefeicoes(prev => prev.map(ref => {
      if (ref.tipo === refeicaoTipo) {
        const alimentoRemovido = ref.comidas.find((c: any) => c.id === alimentoId);
        return {
          ...ref,
          comidas: ref.comidas.filter((c: any) => c.id !== alimentoId),
          totalCalorias: ref.totalCalorias - (alimentoRemovido?.calorias || 0)
        };
      }
      return ref;
    }));
  };

  // Filtragem da busca
  const alimentosFiltrados = todosAlimentos.filter(a => 
    a.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <div key={idx} className="p-4 border rounded-lg hover:border-secondary transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{ref.tipo}</h4>
                <div className="flex gap-2">
                    {/* Botões da Refeição */}
                    <Button size="sm" variant="ghost" onClick={() => setSelectedMeal(ref.tipo)}>
                        <Plus className="h-4 w-4 mr-1" /> Adicionar
                    </Button>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{ref.comidas.length} itens</span>
                <span className="font-medium text-secondary">{ref.totalCalorias} kcal</span>
              </div>
              {/* Lista compacta visual */}
              <div className="flex flex-wrap gap-1 mt-2">
                {ref.comidas.map((c, i) => (
                    <Badge key={i} variant="secondary" className="text-xs font-normal">
                        {c.nome} <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => handleRemoveFood(ref.tipo, c.id)}/>
                    </Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* MODAL PRINCIPAL */}
      <Dialog open={selectedMeal !== null} onOpenChange={() => { setSelectedMeal(null); setIsCreating(false); }}>
        <DialogContent className="max-w-md max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
                {isCreating ? "Novo Alimento Personalizado" : `Adicionar ao ${selectedMeal}`}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 flex-1 min-h-0 py-2">
            
            {/* MODO CRIAÇÃO (FORMULÁRIO) */}
            {isCreating ? (
                <div className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Nome do Alimento</Label>
                        <Input 
                            value={newFoodData.name} 
                            onChange={e => setNewFoodData({...newFoodData, name: e.target.value})}
                            placeholder="Ex: Tapioca com Queijo"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Calorias (kcal)</Label>
                            <Input type="number" value={newFoodData.calories} onChange={e => setNewFoodData({...newFoodData, calories: e.target.value})} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Proteínas (g)</Label>
                            <Input type="number" value={newFoodData.protein} onChange={e => setNewFoodData({...newFoodData, protein: e.target.value})} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Carboidratos (g)</Label>
                            <Input type="number" value={newFoodData.carbs} onChange={e => setNewFoodData({...newFoodData, carbs: e.target.value})} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Gorduras (g)</Label>
                            <Input type="number" value={newFoodData.fats} onChange={e => setNewFoodData({...newFoodData, fats: e.target.value})} />
                        </div>
                    </div>
                    <div className="flex gap-2 pt-4">
                        <Button variant="outline" onClick={() => setIsCreating(false)} className="w-full">
                            <ArrowLeft className="h-4 w-4 mr-2"/> Voltar
                        </Button>
                        <Button onClick={handleSaveNewFood} className="w-full">
                            <Save className="h-4 w-4 mr-2"/> Salvar
                        </Button>
                    </div>
                </div>
            ) : (
                /* MODO LISTAGEM (BUSCA) */
                <>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="secondary" onClick={() => {
                            setIsCreating(true);
                            setNewFoodData(prev => ({...prev, name: searchTerm})); // Já preenche o nome
                        }}>
                            <Plus className="h-4 w-4"/> Criar
                        </Button>
                    </div>

                    <div className="space-y-2 overflow-y-auto flex-1 pr-2 max-h-[400px]">
                        {alimentosFiltrados.map((alimento) => (
                            <div
                                key={alimento.id}
                                className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                                onClick={() => {
                                    if (selectedFoods.includes(alimento.id)) {
                                        setSelectedFoods(prev => prev.filter(id => id !== alimento.id));
                                    } else {
                                        setSelectedFoods(prev => [...prev, alimento.id]);
                                    }
                                }}
                            >
                                <Checkbox checked={selectedFoods.includes(alimento.id)} />
                                <div className="flex-1">
                                    <h4 className="font-medium text-sm">{alimento.nome}</h4>
                                    <div className="text-xs text-muted-foreground">
                                        {alimento.calorias} kcal • P: {alimento.proteinas}g • C: {alimento.carbs}g • G: {alimento.gords}g
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <Button onClick={handleAddFoods} disabled={selectedFoods.length === 0} className="mt-2">
                        Adicionar Selecionados ({selectedFoods.length})
                    </Button>
                </>
            )}
            
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MealManager;
