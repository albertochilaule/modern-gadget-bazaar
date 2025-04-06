
import { ShoppingCart, DollarSign, Users, Package } from 'lucide-react';
import DashboardCard from '@/components/admin/DashboardCard';
import StockAlertChart from '@/components/admin/StockAlertChart';
import TopSellingProducts from '@/components/admin/TopSellingProducts';
import RecentOrders from '@/components/admin/RecentOrders';

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard 
          title="Pedidos Hoje" 
          value="150" 
          icon={ShoppingCart} 
          color="bg-blue-500"
        />
        <DashboardCard 
          title="Faturamento Hoje" 
          value="R$ 25.000" 
          icon={DollarSign} 
          color="bg-green-600"
        />
        <DashboardCard 
          title="Novos Clientes" 
          value="45" 
          icon={Users} 
          color="bg-yellow-500"
        />
        <DashboardCard 
          title="Produtos" 
          value="1.250" 
          icon={Package} 
          color="bg-cyan-500"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StockAlertChart />
        <TopSellingProducts />
      </div>
      
      <RecentOrders />
    </div>
  );
};

export default AdminDashboard;
