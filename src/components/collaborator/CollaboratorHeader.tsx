
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const CollaboratorHeader = () => {
  const { user, logout } = useAuth();

  return (
    <header className="border-b p-4 bg-background flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <SidebarTrigger />
        <h1 className="text-2xl font-semibold">Painel do Colaborador</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center">
          <span className="mr-2">
            Olá, {user?.name} 
            <span className="ml-2 text-sm text-blue-600 font-medium">(Colaborador)</span>
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={logout}>
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>
    </header>
  );
};

export default CollaboratorHeader;
