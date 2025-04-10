
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { processPayment, isPaymentSuccessful, getResponseMessage } from "@/services/mpesaService";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface MpesaPaymentFormProps {
  amount: number;
  onSuccess?: () => void;
  onError?: () => void;
  reference?: string;
}

const MpesaPaymentForm = ({ amount, onSuccess, onError, reference }: MpesaPaymentFormProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber) {
      toast({
        title: "Erro no pagamento",
        description: "Por favor, insira um número de telefone válido",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    setPaymentStatus("processing");
    
    try {
      // Process the payment
      const response = await processPayment(phoneNumber, amount, reference);
      
      // Check if payment was successful
      if (isPaymentSuccessful(response)) {
        setPaymentStatus("success");
        setStatusMessage("Pagamento processado com sucesso! Por favor, verifique seu telefone para confirmar a transação.");
        toast({
          title: "Pagamento iniciado",
          description: "Por favor, confirme o pagamento no seu telefone",
          variant: "success",
        });
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setPaymentStatus("error");
        setStatusMessage(getResponseMessage(response.output_ResponseCode));
        toast({
          title: "Erro no pagamento",
          description: getResponseMessage(response.output_ResponseCode),
          variant: "destructive",
        });
        
        if (onError) {
          onError();
        }
      }
    } catch (error) {
      setPaymentStatus("error");
      setStatusMessage("Ocorreu um erro ao processar o pagamento. Por favor, tente novamente.");
      toast({
        title: "Erro no pagamento",
        description: "Ocorreu um erro ao processar o pagamento",
        variant: "destructive",
      });
      
      if (onError) {
        onError();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Pagamento via M-Pesa</CardTitle>
        <CardDescription>
          Insira seu número de telefone M-Pesa para completar o pagamento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Número de Telefone</Label>
              <Input
                id="phone"
                type="text"
                placeholder="Ex: 84XXXXXXX ou 258XXXXXXXXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isProcessing}
              />
              <p className="text-sm text-muted-foreground">
                Insira seu número de telefone M-Pesa registrado
              </p>
            </div>
            
            <div className="border p-3 rounded-md bg-muted/50">
              <p className="text-sm font-medium">Valor a pagar:</p>
              <p className="text-2xl font-bold text-green-600">
                {amount.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
              </p>
            </div>

            {paymentStatus !== "idle" && (
              <div className={`p-4 rounded-md ${
                paymentStatus === "processing" ? "bg-yellow-50 text-yellow-800" :
                paymentStatus === "success" ? "bg-green-50 text-green-800" : 
                "bg-red-50 text-red-800"
              }`}>
                <div className="flex items-center">
                  {paymentStatus === "processing" && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
                  {paymentStatus === "success" && <CheckCircle2 className="h-5 w-5 mr-2 text-green-600" />}
                  {paymentStatus === "error" && <AlertCircle className="h-5 w-5 mr-2 text-red-600" />}
                  <p className="text-sm">{statusMessage}</p>
                </div>
              </div>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-green-600 hover:bg-green-700" 
          onClick={handleSubmit}
          disabled={isProcessing || phoneNumber.length < 9}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            'Pagar com M-Pesa'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MpesaPaymentForm;
