
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, MapPin, Phone, Mail } from "lucide-react";

// Define the form schema with validation
const customerDataSchema = z.object({
  fullName: z.string().min(3, "Nome completo é obrigatório e deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().min(9, "Número de telefone deve ter pelo menos 9 dígitos"),
  address: z.string().min(3, "Endereço é obrigatório e deve ter pelo menos 3 caracteres"),
  idNumber: z.string().min(5, "Número de identificação é obrigatório")
});

export type CustomerData = z.infer<typeof customerDataSchema>;

interface CustomerDataFormProps {
  onSubmit: (data: CustomerData) => void;
  initialData?: Partial<CustomerData>;
}

const CustomerDataForm = ({ onSubmit, initialData = {} }: CustomerDataFormProps) => {
  // Initialize the form with react-hook-form
  const form = useForm<CustomerData>({
    resolver: zodResolver(customerDataSchema),
    defaultValues: {
      fullName: initialData.fullName || "",
      email: initialData.email || "",
      phone: initialData.phone || "",
      address: initialData.address || "",
      idNumber: initialData.idNumber || ""
    }
  });

  const handleSubmit = (data: CustomerData) => {
    onSubmit(data);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Informações pessoais</CardTitle>
        <CardDescription>
          Forneça seus dados para validação na retirada do produto
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <FormControl>
                      <Input placeholder="Seu nome completo" className="pl-10" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de telefone</FormLabel>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <FormControl>
                      <Input placeholder="Ex: 84XXXXXXX" className="pl-10" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (opcional)</FormLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <FormControl>
                      <Input placeholder="seu@email.com" className="pl-10" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço</FormLabel>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <FormControl>
                      <Input placeholder="Seu endereço completo" className="pl-10" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="idNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de identificação (BI/Passaporte)</FormLabel>
                  <FormControl>
                    <Input placeholder="Número do seu documento de identidade" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-century-primary hover:bg-green-600 mt-4"
            >
              Continuar para pagamento
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CustomerDataForm;
