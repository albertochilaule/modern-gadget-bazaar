
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, FileBarChart2, UserCircle } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";

const CollaboratorSidebar = () => {
  const { user } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/colaborador/dashboard" },
    { icon: Package, label: "Produtos", path: "/colaborador/produtos" },
    { icon: FileBarChart2, label: "Relatórios", path: "/colaborador/relatorios" },
    { icon: UserCircle, label: "Meu Perfil", path: "/colaborador/meu-perfil" },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center py-4 border-b border-sidebar-border">
        <div className="flex flex-col items-center justify-center space-y-1 px-3">
          <img src="/lovable-uploads/c16ab0f7-6e61-45b2-a7cc-270f77fdbbb7.png" alt="Logo" className="h-6 w-auto" />
          <h1 className="text-lg font-semibold text-sidebar-foreground">Área do Colaborador</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => (isActive ? "data-[active=true]" : "")}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground mr-2">
            {user?.name?.charAt(0) || "C"}
          </div>
          <div>
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-sidebar-foreground/70">{user?.email}</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default CollaboratorSidebar;
