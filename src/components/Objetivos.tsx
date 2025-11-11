import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target, TrendingDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Objetivos = () => {
  const [selectedObjetivo, setSelectedObjetivo] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Dados mockados - conectar com GET /api/objetivos
  const objetivos = [
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
  ];

  const handleEdit = () => {
    // Conectar com PUT /api/objetivos/{id}
    toast({
      title: "Objetivo atualizado!",
      description: "Suas alterações foram salvas com sucesso.",
    });
    setIsEditing(false);
    setSelectedObjetivo(null);
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
              onClick={() => setSelectedObjetivo(obj)}
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
          <Button className="w-full" variant="outline">
            + Nova Meta
          </Button>
        </CardContent>
      </Card>

      {/* Modal de Detalhes/Edição */}
      <Dialog open={selectedObjetivo !== null} onOpenChange={() => setSelectedObjetivo(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar Objetivo" : "Detalhes do Objetivo"}
            </DialogTitle>
            <DialogDescription>
              {isEditing ? "Atualize as informações do seu objetivo" : "Visualize os detalhes"}
            </DialogDescription>
          </DialogHeader>
          {selectedObjetivo && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Foco</Label>
                {isEditing ? (
                  <Input defaultValue={selectedObjetivo.foco} />
                ) : (
                  <p className="text-sm">{selectedObjetivo.foco}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Peso Inicial</Label>
                  {isEditing ? (
                    <Input type="number" defaultValue={selectedObjetivo.pesoIni} />
                  ) : (
                    <p className="text-sm">{selectedObjetivo.pesoIni} kg</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Peso Meta</Label>
                  {isEditing ? (
                    <Input type="number" defaultValue={selectedObjetivo.pesoFim} />
                  ) : (
                    <p className="text-sm">{selectedObjetivo.pesoFim} kg</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data Início</Label>
                  {isEditing ? (
                    <Input type="date" defaultValue={selectedObjetivo.dataIni} />
                  ) : (
                    <p className="text-sm">{new Date(selectedObjetivo.dataIni).toLocaleDateString()}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Data Fim</Label>
                  {isEditing ? (
                    <Input type="date" defaultValue={selectedObjetivo.dataFim} />
                  ) : (
                    <p className="text-sm">{new Date(selectedObjetivo.dataFim).toLocaleDateString()}</p>
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
    </>
  );
};

export default Objetivos;
