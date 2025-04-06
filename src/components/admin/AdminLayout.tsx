
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { Toaster } from "@/components/ui/toaster";

const AdminLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-sidebar">
        <AdminSidebar />
        <div className="flex flex-1 flex-col">
          <AdminHeader />
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  );
};

export default AdminLayout;
