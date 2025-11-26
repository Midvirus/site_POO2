import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Apple, Plus, Search, X, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useDashboard } from "@/contexts/DashboardContext";
import { Badge } from "@/components/ui/badge";

// Interface para tipar os dados que vêm do Backend
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

  // Estado para armazenar as comidas vindas do Banco de Dados
  const [todosAlimentos, setTodosAlimentos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Estado local das refeições do dia
  const [refeicoes, setRefeicoes] = useState([
    { tipo: "Café da Manhã", totalCalorias: 0, comidas: [] as any[] },
    { tipo: "Almoço", totalCalorias: 0, comidas: [] as any[] },
    { tipo: "Jantar", totalCalorias: 0, comidas: [] as any[] },
    { tipo: "Lanche", totalCalorias: 0, comidas: [] as any[] },
  ]);

  // --- 1. BUSCAR COMIDAS DO BACKEND (GET) ---
  const fetchFoods = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/foods");
      if (response.ok) {
        const data: FoodBackend[] = await response.json();
        // Mapeia do Inglês (Backend) para Português (Frontend)
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
      toast({ title: "Erro", description: "Falha ao conectar com o servidor.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // Carrega as comidas assim que o componente abre
  useEffect(() => {
    fetchFoods();
  }, []);

  // --- 2. CRIAR NOVA COMIDA NO BACKEND (POST) ---
  const handleCreateNewFood = async () => {
    if (!searchTerm) return;

    const newFood = {
      name: searchTerm,
      calories: 100, // Valores padrão para teste (depois você pode criar um form completo)
      carbs: 10,
      protein: 10,
      fats: 5,
      quantity: 100
    };

    try {
      const response = await fetch("http://localhost:8080/api/foods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFood)
      });

      if (response.ok) {
        toast({ title: "Sucesso!", description: `Alimento "${searchTerm}" salvo no banco de dados.` });
        fetchFoods(); // Recarrega a lista
        setSearchTerm(""); // Limpa a busca
      } else {
        toast({ title: "Erro", description: "Não foi possível salvar.", variant: "destructive" });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const alimentosFiltrados = todosAlimentos.filter(a => 
    a.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

    toast({
      title: "Alimentos adicionados!",
      description: `${selectedFoods.length} alimento(s) adicionado(s) à refeição.`,
    });
    setSelectedMeal(null);
    setSelectedFoods([]);
    setSearchTerm("");
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

    toast({
      title: "Alimento removido",
      description: "O alimento foi removido da refeição.",
    });
  };

  const handleViewAlimentos = (refeicaoTipo: string) => {
    const refeicao = refeicoes.find(r => r.tipo === refeicaoTipo);
    if (refeicao && refeicao.comidas.length > 0) {
      setSelectedMeal(refeicaoTipo);
      setShowAlimentosModal(true);
    }
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
          <CardDescription>Gerencie suas refeições (Conectado ao DB)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {refeicoes.map((ref, idx) => (
            <div
              key={idx}
              className="p-4 border rounded-lg hover:border-secondary transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{ref.tipo}</h4>
                <div className="flex gap-2">
                  {ref.comidas.length > 0 && (
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleViewAlimentos(ref.tipo)}
                    >
                      Ver Alimentos
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => {
                      setSelectedMeal(ref.tipo);
                      fetchFoods(); // Garante lista atualizada ao abrir
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{ref.comidas.length} alimento(s)</span>
                <span className="font-medium text-secondary">{ref.totalCalorias} kcal</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Modal de Adicionar Alimentos */}
      <Dialog open={selectedMeal !== null && !showAlimentosModal} onOpenChange={() => setSelectedMeal(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Adicionar Alimentos - {selectedMeal}</DialogTitle>
            <DialogDescription>
              Busque no banco de dados ou cadastre um novo.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 flex-1 min-h-0">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar alimentos (ex: Banana)..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {/* Botão para Criar Comida no Banco se não existir */}
              <Button onClick={handleCreateNewFood} variant="secondary" title="Cria um alimento genérico com este nome">
                <Save className="h-4 w-4 mr-2" />
                Cadastrar Novo
              </Button>
            </div>

            <div className="space-y-2 overflow-y-auto flex-1 pr-2">
              {isLoading && <p className="text-center text-muted-foreground">Carregando do banco...</p>}
              
              {!isLoading && alimentosFiltrados.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  <p>Nenhum alimento encontrado.</p>
                  <p className="text-sm">Digite um nome acima e clique em "Cadastrar Novo" para salvar no Banco de Dados.</p>
                </div>
              )}

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
                  Adicionar à Refeição
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Ver Alimentos */}
      <Dialog open={showAlimentosModal} onOpenChange={setShowAlimentosModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alimentos - {selectedMeal}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {selectedMeal && refeicoes.find(r => r.tipo === selectedMeal)?.comidas.map((alimento: any, idx: number) => (
              <div key={idx} className="flex items-start justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{alimento.nome}</h4>
                  <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                    <Badge variant="outline">{alimento.calorias} kcal</Badge>
                    <span>{alimento.proteinas}g prot</span>
                    <span>{alimento.carbs}g carb</span>
                    <span>{alimento.gords}g gord</span>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleRemoveFood(selectedMeal, alimento.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button onClick={() => setShowAlimentosModal(false)} className="w-full">
            Fechar
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MealManager;
