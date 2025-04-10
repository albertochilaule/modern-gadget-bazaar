
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import MpesaPaymentForm from "./MpesaPaymentForm";
import { X } from "lucide-react";

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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Finalizar Pagamento</DialogTitle>
          <Button
            className="absolute right-4 top-4 h-8 w-8 p-0"
            variant="ghost"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="py-4">
          <MpesaPaymentForm 
            amount={amount} 
            onSuccess={() => {
              if (onSuccess) {
                onSuccess();
              }
            }}
            reference={reference}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
