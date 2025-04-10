
import { Package, Users } from 'lucide-react';
import DashboardCard from '@/components/admin/DashboardCard';
import StockAlertChart from '@/components/admin/StockAlertChart';
import TopSellingProducts from '@/components/admin/TopSellingProducts';

const CollaboratorDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DashboardCard 
          title="Total de Produtos" 
          value="1.250" 
          icon={Package} 
          color="bg-cyan-500"
        />
        <DashboardCard 
          title="Clientes Ativos" 
          value="450" 
          icon={Users} 
          color="bg-yellow-500"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StockAlertChart />
        <TopSellingProducts />
      </div>
    </div>
  );
};

export default CollaboratorDashboard;
