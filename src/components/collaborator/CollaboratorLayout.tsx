
import { Outlet } from "react-router-dom";
import CollaboratorSidebar from "./CollaboratorSidebar";
import CollaboratorHeader from "./CollaboratorHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from '@/components/ui/toaster';

const CollaboratorLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <CollaboratorSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <CollaboratorHeader />
          <main className="flex-1 overflow-auto p-6 bg-background">
            <Outlet />
          </main>
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  );
};

export default CollaboratorLayout;
