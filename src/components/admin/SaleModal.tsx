
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Check } from 'lucide-react';

const formSchema = z.object({
  customerName: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  contact: z.string().min(5, { message: 'Contato deve ter pelo menos 5 caracteres' }),
  documentId: z.string().min(5, { message: 'Número de BI/documento é obrigatório' }),
  productId: z.string().min(1, { message: 'Selecione um produto' }),
  quantity: z.coerce.number().min(1, { message: 'Quantidade mínima é 1' }),
  notes: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

interface Product {
  id: string;
  name: string;
  [key: string]: any;
}

interface SaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSale: (data: any) => void;
  products: Product[];
}

const SaleModal = ({ isOpen, onClose, onSale, products }: SaleModalProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: '',
      contact: '',
      documentId: '',
      productId: '',
      quantity: 1,
      notes: ''
    }
  });

  const onSubmit = (values: FormValues) => {
    const selectedProduct = products.find(p => p.id === values.productId);
    onSale({
      ...values,
      productName: selectedProduct?.name,
      customerName: values.customerName
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Venda Online</DialogTitle>
          <Button
            className="absolute right-4 top-4 h-8 w-8 p-0"
            variant="ghost"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do cliente" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contacto</FormLabel>
                  <FormControl>
                    <Input placeholder="Email ou telefone" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="documentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de BI</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o número de documento" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Produto</FormLabel>
                  <FormControl>
                    <select
                      className="w-full h-10 pl-3 pr-10 text-base border rounded-md"
                      {...field}
                    >
                      <option value="">Selecione um produto</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} - {product.price}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1" 
                      {...field}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <textarea
                      className="w-full p-3 h-20 border rounded-md"
                      placeholder="Notas adicionais sobre a venda..."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-2">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                <Check className="mr-2 h-4 w-4" /> CONFIRMAR VENDA
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SaleModal;
