
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import MpesaPaymentForm from "./MpesaPaymentForm";
import CustomerDataForm, { CustomerData } from "./CustomerDataForm";
import { X } from "lucide-react";
import { useState } from "react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onSuccess?: () => void;
  reference?: string;
}

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  amount,
  onSuccess,
  reference
}: PaymentModalProps) => {
  const [isPaymentInProgress, setIsPaymentInProgress] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  
  const handlePaymentStart = () => {
    setIsPaymentInProgress(true);
  };
  
  const handlePaymentSuccess = () => {
    if (onSuccess) {
      onSuccess();
    }
    // Keep modal open to show success message unless onSuccess explicitly closes it
  };
  
  const handlePaymentError = () => {
    // Just reset the payment progress state
    setIsPaymentInProgress(false);
  };
  
  const handleClose = () => {
    // Only allow closing if payment is not in progress
    if (!isPaymentInProgress) {
      onClose();
      // Reset state when modal closes
      setIsPaymentInProgress(false);
      setShowPaymentForm(false);
      setCustomerData(null);
    }
  };

  const handleCustomerDataSubmit = (data: CustomerData) => {
    setCustomerData(data);
    setShowPaymentForm(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {showPaymentForm ? "Finalizar Pagamento" : "Dados para Entrega"}
          </DialogTitle>
          <Button
            className="absolute right-4 top-4 h-8 w-8 p-0"
            variant="ghost"
            onClick={handleClose}
            disabled={isPaymentInProgress}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="py-4">
          {!showPaymentForm ? (
            <CustomerDataForm onSubmit={handleCustomerDataSubmit} />
          ) : (
            <MpesaPaymentForm 
              amount={amount}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              reference={reference}
              onPaymentStart={handlePaymentStart}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
