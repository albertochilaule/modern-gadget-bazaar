
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, CreditCard } from "lucide-react";
import { useState } from "react";
import PaymentModal from "@/components/payment/PaymentModal";
import { generateTransactionReference } from "@/services/mpesaService";
import { useToast } from "@/hooks/use-toast";

const CollaboratorHeader = () => {
  const { user, logout } = useAuth();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [transactionReference, setTransactionReference] = useState("");
  const { toast } = useToast();

  const handleQuickPayment = () => {
    setTransactionReference(generateTransactionReference());
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    toast({
      title: "Pagamento processado",
      description: "O pagamento rápido foi processado com sucesso!",
      variant: "success",
    });
    setIsPaymentModalOpen(false);
  };

  return (
    <header className="border-b p-4 bg-background flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <SidebarTrigger />
        <h1 className="text-2xl font-semibold">Painel do Colaborador</h1>
      </div>
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="hidden md:flex border-green-600 text-green-600 hover:bg-green-50"
          onClick={handleQuickPayment}
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Pagamento Rápido
        </Button>
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

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        amount={100} // Default amount for quick payment
        onSuccess={handlePaymentSuccess}
        reference={transactionReference}
      />
    </header>
  );
};

export default CollaboratorHeader;
