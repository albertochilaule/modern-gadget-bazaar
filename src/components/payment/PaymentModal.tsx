import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import MpesaPaymentForm from "./MpesaPaymentForm";
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
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Finalizar Pagamento</DialogTitle>
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
          <MpesaPaymentForm 
            amount={amount}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            reference={reference}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
