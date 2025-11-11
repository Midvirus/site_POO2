import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target, TrendingDown, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Objetivos = () => {
  const [selectedObjetivo, setSelectedObjetivo] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showNewObjetivo, setShowNewObjetivo] = useState(false);
  const [editedObjetivo, setEditedObjetivo] = useState<any>(null);
  const [newObjetivo, setNewObjetivo] = useState({
    foco: "",
    pesoIni: "",
    pesoFim: "",
    dataIni: "",
    dataFim: "",
  });

  // Dados mockados - conectar com GET /api/objetivos
  const [objetivos, setObjetivos] = useState([
    {
      id: "1",
      foco: "Perder Peso",
      pesoIni: 85,
      pesoFim: 75,
      dataIni: "2025-01-01",
      dataFim: "2025-06-01",
      status: "Ativo"
    },
    {
      id: "2",
      foco: "Ganhar Massa Muscular",
      pesoIni: 75,
      pesoFim: 80,
      dataIni: "2025-06-01",
      dataFim: "2025-12-01",
      status: "Pausado"
    }
  ]);

  const handleEdit = () => {
    // Conectar com PUT /api/objetivos/{id}
    if (editedObjetivo) {
      setObjetivos(prev => prev.map(obj => 
        obj.id === editedObjetivo.id ? editedObjetivo : obj
      ));
    }
    
    toast({
      title: "Objetivo atualizado!",
      description: "Suas alterações foram salvas com sucesso.",
    });
    setIsEditing(false);
    setSelectedObjetivo(null);
    setEditedObjetivo(null);
  };

  const handleCreate = () => {
    if (!newObjetivo.foco || !newObjetivo.pesoIni || !newObjetivo.pesoFim || !newObjetivo.dataIni || !newObjetivo.dataFim) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    // POST /api/objetivos
    const novoObj = {
      id: String(Date.now()),
      ...newObjetivo,
      pesoIni: Number(newObjetivo.pesoIni),
      pesoFim: Number(newObjetivo.pesoFim),
      status: "Ativo"
    };

    setObjetivos(prev => [...prev, novoObj]);

    toast({
      title: "Meta criada!",
      description: "Sua nova meta foi criada com sucesso.",
    });

    setNewObjetivo({ foco: "", pesoIni: "", pesoFim: "", dataIni: "", dataFim: "" });
    setShowNewObjetivo(false);
  };

  const handleStatusChange = (status: string) => {
    if (editedObjetivo) {
      setEditedObjetivo({ ...editedObjetivo, status });
    }
  };

  const openEditModal = (obj: any) => {
    setSelectedObjetivo(obj);
    setEditedObjetivo({ ...obj });
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <CardTitle>Metas e Objetivos</CardTitle>
          </div>
          <CardDescription>Acompanhe seu progresso</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {objetivos.map((obj) => (
            <div
              key={obj.id}
              className="p-4 border rounded-lg hover:border-primary cursor-pointer transition-colors"
              onClick={() => openEditModal(obj)}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold">{obj.foco}</h4>
                <Badge variant={obj.status === "Ativo" ? "default" : "secondary"}>
                  {obj.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingDown className="h-4 w-4" />
                <span>{obj.pesoIni}kg → {obj.pesoFim}kg</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(obj.dataIni).toLocaleDateString()} - {new Date(obj.dataFim).toLocaleDateString()}
              </p>
            </div>
          ))}
          <Button className="w-full" variant="outline" onClick={() => setShowNewObjetivo(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Meta
          </Button>
        </CardContent>
      </Card>

      {/* Modal de Detalhes/Edição */}
      <Dialog open={selectedObjetivo !== null} onOpenChange={() => {
        setSelectedObjetivo(null);
        setIsEditing(false);
        setEditedObjetivo(null);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar Objetivo" : "Detalhes do Objetivo"}
            </DialogTitle>
            <DialogDescription>
              {isEditing ? "Atualize as informações do seu objetivo" : "Visualize os detalhes"}
            </DialogDescription>
          </DialogHeader>
          {editedObjetivo && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Foco</Label>
                {isEditing ? (
                  <Input 
                    value={editedObjetivo.foco}
                    onChange={(e) => setEditedObjetivo({ ...editedObjetivo, foco: e.target.value })}
                  />
                ) : (
                  <p className="text-sm">{editedObjetivo.foco}</p>
                )}
              </div>
              
              {isEditing && (
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={editedObjetivo.status} onValueChange={handleStatusChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Pausado">Pausado</SelectItem>
                      <SelectItem value="Concluído">Concluído</SelectItem>
                      <SelectItem value="Cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Peso Inicial</Label>
                  {isEditing ? (
                    <Input 
                      type="number" 
                      value={editedObjetivo.pesoIni}
                      onChange={(e) => setEditedObjetivo({ ...editedObjetivo, pesoIni: Number(e.target.value) })}
                    />
                  ) : (
                    <p className="text-sm">{editedObjetivo.pesoIni} kg</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Peso Meta</Label>
                  {isEditing ? (
                    <Input 
                      type="number" 
                      value={editedObjetivo.pesoFim}
                      onChange={(e) => setEditedObjetivo({ ...editedObjetivo, pesoFim: Number(e.target.value) })}
                    />
                  ) : (
                    <p className="text-sm">{editedObjetivo.pesoFim} kg</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data Início</Label>
                  {isEditing ? (
                    <Input 
                      type="date" 
                      value={editedObjetivo.dataIni}
                      onChange={(e) => setEditedObjetivo({ ...editedObjetivo, dataIni: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm">{new Date(editedObjetivo.dataIni).toLocaleDateString()}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Data Fim</Label>
                  {isEditing ? (
                    <Input 
                      type="date" 
                      value={editedObjetivo.dataFim}
                      onChange={(e) => setEditedObjetivo({ ...editedObjetivo, dataFim: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm">{new Date(editedObjetivo.dataFim).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleEdit}>Salvar</Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Editar</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Nova Meta */}
      <Dialog open={showNewObjetivo} onOpenChange={setShowNewObjetivo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Nova Meta</DialogTitle>
            <DialogDescription>
              Defina seu novo objetivo
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="foco">Foco</Label>
              <Input
                id="foco"
                placeholder="Ex: Perder Peso, Ganhar Massa"
                value={newObjetivo.foco}
                onChange={(e) => setNewObjetivo({ ...newObjetivo, foco: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pesoIni">Peso Inicial (kg)</Label>
                <Input
                  id="pesoIni"
                  type="number"
                  value={newObjetivo.pesoIni}
                  onChange={(e) => setNewObjetivo({ ...newObjetivo, pesoIni: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pesoFim">Peso Meta (kg)</Label>
                <Input
                  id="pesoFim"
                  type="number"
                  value={newObjetivo.pesoFim}
                  onChange={(e) => setNewObjetivo({ ...newObjetivo, pesoFim: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataIni">Data Início</Label>
                <Input
                  id="dataIni"
                  type="date"
                  value={newObjetivo.dataIni}
                  onChange={(e) => setNewObjetivo({ ...newObjetivo, dataIni: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataFim">Data Fim</Label>
                <Input
                  id="dataFim"
                  type="date"
                  value={newObjetivo.dataFim}
                  onChange={(e) => setNewObjetivo({ ...newObjetivo, dataFim: e.target.value })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewObjetivo(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreate}>Criar Meta</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Objetivos;
