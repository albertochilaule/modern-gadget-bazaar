
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

const AdminHeader = () => {
  const { user, logout, isAdmin, isCollaborator } = useAuth();

  return (
    <header className="border-b p-4 bg-background flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <SidebarTrigger />
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center">
          <span className="mr-2">
            Olá, {user?.name} 
            {isAdmin && <span className="ml-2 text-sm text-green-600 font-medium">(Administrador)</span>}
            {isCollaborator && <span className="ml-2 text-sm text-blue-600 font-medium">(Colaborador)</span>}
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

export default AdminHeader;
