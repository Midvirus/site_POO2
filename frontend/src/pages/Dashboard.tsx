import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Routine from "@/components/Routine";
import Objetivos from "@/components/Objetivos";
import MealManager from "@/components/MealManager";
import Reports from "@/components/Reports";
import WeightHistory from "@/components/WeightHistory";
import { DashboardProvider } from "@/contexts/DashboardContext";
import { useParams } from "react-router-dom";

const Dashboard = () => {
  const { nome } = useParams();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/auth");
  };

  return (
    <DashboardProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary" />
              <div>
                <h2 className="text-sm font-semibold">Bem-vindo, {nome}</h2>
                <p className="text-xs text-muted-foreground">Seus treinos de hoje</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              /*<Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>*/
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container py-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Routine />
            <Reports />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Objetivos />
            <MealManager />
          </div>
          <WeightHistory />
        </main>
      </div>
    </DashboardProvider>
  );
};

export default Dashboard;
