import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Dumbbell } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Estados do Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Estados do Cadastro
  const [registerData, setRegisterData] = useState({
    nome: "",
    username: "",
    password: "",
    birthDate: "",
    gender: "",
    weight: "",
    height: "",
    activityLevel: ""
  });

  // --- LOGIN REAL ---
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
        const response = await fetch("http://localhost:8080/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: loginEmail,
                password: loginPassword 
            })
        });

        if (response.ok) {
            const data = await response.json();
            
            // Salva sessão
            localStorage.setItem("isAuthenticated", "true");
            localStorage.setItem("userId", data.id);
            localStorage.setItem("userName", data.nome);

            toast({ title: "Login realizado!", description: `Bem-vindo, ${data.nome}` });
            
            // REDIRECIONA (Se sua página principal for /dashboard, mude aqui)
            navigate(`/Dashboard/${data.nome}`);
            
        } else {
            toast({ title: "Erro de Acesso", description: "Usuário ou senha incorretos.", variant: "destructive" });
        }
    } catch (error) {
        console.error(error);
        toast({ title: "Erro de Conexão", description: "O servidor não respondeu.", variant: "destructive" });
    } finally {
        setIsLoading(false);
    }
  };

  // --- CADASTRO REAL ---
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const activityMap: Record<string, number> = {
        "Sedentário": 1, "Leve": 2, "Moderado": 3, "Intenso": 4, "Muito Intenso": 5
    };

    const payload = {
        nome: registerData.nome,
        username: registerData.username,
        password: registerData.password,
        confirmPassword: registerData.password,
        birthDate: registerData.birthDate,
        gender: registerData.gender,
        weight: parseFloat(registerData.weight),
        height: parseFloat(registerData.height),
        activityLevel: activityMap[registerData.activityLevel] || 3
    };
    
    try {
        const response = await fetch("http://localhost:8080/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            toast({ title: "Sucesso!", description: "Conta criada. Faça login." });
            // Opcional: Limpar form ou trocar de aba
        } else {
            const errorText = await response.text();
            toast({ title: "Erro no cadastro", description: errorText, variant: "destructive" });
        }
    } catch (error) {
        toast({ title: "Erro", description: "Falha ao conectar com o servidor.", variant: "destructive" });
    } finally {
        setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target;
      setRegisterData(prev => ({ ...prev, [id]: value }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setRegisterData(prev => ({ ...prev, username: e.target.value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-primary-glow p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-primary rounded-full">
              <Dumbbell className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Gestor de Academia</CardTitle>
          <CardDescription>Gerencie seus treinos, metas e alimentação</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Cadastro</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input 
                    id="login-email" 
                    type="text" 
                    placeholder="nome@email.com" 
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Senha</Label>
                  <Input 
                    id="login-password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required 
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input id="nome" placeholder="Seu nome" value={registerData.nome} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Email (Login)</Label>
                  <Input id="username" type="text" placeholder="seu@email.com" value={registerData.username} onChange={handleEmailChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input id="password" type="password" placeholder="••••••••" value={registerData.password} onChange={handleInputChange} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Data de Nascimento</Label>
                    <Input id="birthDate" type="date" value={registerData.birthDate} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gênero</Label>
                    <Select onValueChange={(val) => setRegisterData(prev => ({ ...prev, gender: val }))}>
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Masculino</SelectItem>
                        <SelectItem value="F">Feminino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Peso (kg)</Label>
                    <Input id="weight" type="number" step="0.1" placeholder="70.0" value={registerData.weight} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Altura (cm)</Label>
                    <Input id="height" type="number" placeholder="170" value={registerData.height} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activityLevel">Nível de Atividade</Label>
                  <Select onValueChange={(val) => setRegisterData(prev => ({ ...prev, activityLevel: val }))}>
                    <SelectTrigger id="activityLevel">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sedentário">Sedentário</SelectItem>
                      <SelectItem value="Leve">Leve</SelectItem>
                      <SelectItem value="Moderado">Moderado</SelectItem>
                      <SelectItem value="Intenso">Intenso</SelectItem>
                      <SelectItem value="Muito Intenso">Muito Intenso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Cadastrando..." : "Cadastrar"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
