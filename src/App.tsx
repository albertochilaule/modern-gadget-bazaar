
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "@/hooks/useCart";
import { AuthProvider } from "@/hooks/useAuth";
import { useState } from "react";

import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminCategories from "./pages/admin/Categories";
import AdminUsers from "./pages/admin/Users";
import AdminReports from "./pages/admin/Reports";
import AdminSettings from "./pages/admin/Settings";
import AdminProfile from "./pages/admin/Profile";
import AdminLayout from "./components/admin/AdminLayout";

// Collaborator pages
import CollaboratorDashboard from "./pages/collaborator/Dashboard";
import CollaboratorProducts from "./pages/collaborator/Products";
import CollaboratorReports from "./pages/collaborator/Reports";
import CollaboratorProfile from "./pages/collaborator/Profile";
import CollaboratorLayout from "./components/collaborator/CollaboratorLayout";

import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  // Create a new QueryClient instance inside the component
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/produto/:id" element={<ProductDetail />} />
                <Route path="/carrinho" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Register />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="produtos" element={<AdminProducts />} />
                  <Route path="categorias" element={<AdminCategories />} />
                  <Route path="usuarios" element={<AdminUsers />} />
                  <Route path="relatorios" element={<AdminReports />} />
                  <Route path="configuracoes" element={<AdminSettings />} />
                  <Route path="meu-perfil" element={<AdminProfile />} />
                </Route>
                
                {/* Collaborator Routes */}
                <Route path="/colaborador" element={
                  <ProtectedRoute requiredRole="colaborador">
                    <CollaboratorLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Navigate to="/colaborador/dashboard" replace />} />
                  <Route path="dashboard" element={<CollaboratorDashboard />} />
                  <Route path="produtos" element={<CollaboratorProducts />} />
                  <Route path="relatorios" element={<CollaboratorReports />} />
                  <Route path="meu-perfil" element={<CollaboratorProfile />} />
                </Route>
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
