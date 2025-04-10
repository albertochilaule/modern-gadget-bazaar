
import { Package, Users, CreditCard } from 'lucide-react';
import DashboardCard from '@/components/admin/DashboardCard';
import StockAlertChart from '@/components/admin/StockAlertChart';
import TopSellingProducts from '@/components/admin/TopSellingProducts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useState } from 'react';
import PaymentModal from '@/components/payment/PaymentModal';
import { useToast } from '@/hooks/use-toast';
import { generateTransactionReference } from '@/services/mpesaService';

const CollaboratorDashboard = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [transactionReference, setTransactionReference] = useState("");
  const { toast } = useToast();

  const handleInitiatePayment = (amount: number) => {
    setPaymentAmount(amount);
    setTransactionReference(generateTransactionReference());
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false);
    toast({
      title: "Pagamento processado",
      description: "O pagamento foi processado com sucesso!",
      variant: "success",
    });
  };

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
      
      <Card>
        <CardHeader>
          <CardTitle>Pagamentos M-Pesa</CardTitle>
          <CardDescription>
            Iniciar um novo pagamento via M-Pesa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 border-2 border-green-100 hover:border-green-300 transition-all cursor-pointer">
              <div className="text-center">
                <CreditCard className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <p className="text-lg font-medium mb-2">Pagamento Pequeno</p>
                <p className="text-2xl font-bold text-green-600 mb-4">MZN 100</p>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700" 
                  onClick={() => handleInitiatePayment(100)}
                >
                  Iniciar Pagamento
                </Button>
              </div>
            </Card>
            
            <Card className="p-4 border-2 border-green-100 hover:border-green-300 transition-all cursor-pointer">
              <div className="text-center">
                <CreditCard className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <p className="text-lg font-medium mb-2">Pagamento Médio</p>
                <p className="text-2xl font-bold text-green-600 mb-4">MZN 500</p>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700" 
                  onClick={() => handleInitiatePayment(500)}
                >
                  Iniciar Pagamento
                </Button>
              </div>
            </Card>
            
            <Card className="p-4 border-2 border-green-100 hover:border-green-300 transition-all cursor-pointer">
              <div className="text-center">
                <CreditCard className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <p className="text-lg font-medium mb-2">Pagamento Grande</p>
                <p className="text-2xl font-bold text-green-600 mb-4">MZN 1000</p>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700" 
                  onClick={() => handleInitiatePayment(1000)}
                >
                  Iniciar Pagamento
                </Button>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StockAlertChart />
        <TopSellingProducts />
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        amount={paymentAmount}
        onSuccess={handlePaymentSuccess}
        reference={transactionReference}
      />
    </div>
  );
};

export default CollaboratorDashboard;
