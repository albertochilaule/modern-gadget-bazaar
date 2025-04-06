
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  brand: z.string().min(1, { message: 'Marca é obrigatória' }),
  category: z.string().min(1, { message: 'Categoria é obrigatória' }),
  price: z.string().min(1, { message: 'Preço é obrigatório' }),
  stock: z.coerce.number().min(0),
  status: z.enum(['Ativo', 'Inativo', 'Estoque Baixo']),
  processor: z.string().optional(),
  memory: z.string().optional(),
  storage: z.string().optional(),
  graphics: z.string().optional(),
  display: z.string().optional(),
  battery: z.string().optional(),
  os: z.string().optional(),
  weight: z.string().optional(),
  dimensions: z.string().optional(),
  colors: z.string().optional(),
  warranty: z.string().optional(),
  shortDescription: z.string().optional(),
  fullDescription: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: string;
  stock: number;
  status: 'Ativo' | 'Inativo' | 'Estoque Baixo';
  image?: string;
  processor?: string;
  memory?: string;
  storage?: string;
  screenSize?: string;
  operatingSystem?: string;
  // Add other properties that might be in editProduct
  graphics?: string;
  display?: string;
  battery?: string;
  os?: string;
  weight?: string;
  dimensions?: string;
  colors?: string;
  warranty?: string;
  shortDescription?: string;
  fullDescription?: string;
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: any) => void;
  editProduct?: Product;
}

const AddProductModal = ({ isOpen, onClose, onAddProduct, editProduct }: AddProductModalProps) => {
  const [mainImage, setMainImage] = useState<File | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      brand: '',
      category: '',
      price: '',
      stock: 0,
      status: 'Ativo',
      processor: '',
      memory: '',
      storage: '',
      graphics: '',
      display: '',
      battery: '',
      os: '',
      weight: '',
      dimensions: '',
      colors: '',
      warranty: '',
      shortDescription: '',
      fullDescription: ''
    }
  });

  // Update form when editProduct changes
  useEffect(() => {
    if (editProduct) {
      form.reset({
        name: editProduct.name || '',
        brand: editProduct.brand || '',
        category: editProduct.category || '',
        price: editProduct.price || '',
        stock: editProduct.stock || 0,
        status: editProduct.status || 'Ativo',
        processor: editProduct.processor || '',
        memory: editProduct.memory || '',
        storage: editProduct.storage || '',
        graphics: editProduct.graphics || '',
        display: editProduct.display || editProduct.screenSize || '',
        battery: editProduct.battery || '',
        os: editProduct.os || editProduct.operatingSystem || '',
        weight: editProduct.weight || '',
        dimensions: editProduct.dimensions || '',
        colors: editProduct.colors || '',
        warranty: editProduct.warranty || '',
        shortDescription: editProduct.shortDescription || '',
        fullDescription: editProduct.fullDescription || ''
      });
    }
  }, [editProduct, form]);

  const onSubmit = (values: FormValues) => {
    const productData = {
      ...values,
      image: mainImage ? URL.createObjectURL(mainImage) : (editProduct?.image || '/placeholder.svg')
    };
    
    // If we're editing, preserve the ID
    if (editProduct) {
      productData.id = editProduct.id;
    }
    
    onAddProduct(productData);
  };

  const modalTitle = editProduct ? 'Editar Produto' : 'Novo Produto';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{modalTitle}</DialogTitle>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Produto</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Dell XPS 15" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marca</FormLabel>
                    <FormControl>
                      <select
                        className="w-full h-10 pl-3 pr-10 border rounded-md"
                        {...field}
                      >
                        <option value="">Selecione a marca</option>
                        <option value="Dell">Dell</option>
                        <option value="Apple">Apple</option>
                        <option value="Lenovo">Lenovo</option>
                        <option value="HP">HP</option>
                        <option value="Samsung">Samsung</option>
                      </select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <FormControl>
                      <select
                        className="w-full h-10 pl-3 pr-10 border rounded-md"
                        {...field}
                      >
                        <option value="">Selecione a categoria</option>
                        <option value="Laptops">Laptops</option>
                        <option value="Smartphones">Smartphones</option>
                        <option value="Tablets">Tablets</option>
                        <option value="Acessórios">Acessórios</option>
                      </select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: R$ 4.999,00" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-lg font-semibold pt-4 border-t">Especificações Técnicas</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="processor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Processador</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Intel Core i7 11ª geração" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="memory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Memória RAM</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 16GB DDR4" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="storage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Armazenamento</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: SSD 512GB" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="graphics"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Placa de Vídeo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: NVIDIA RTX 3060" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="display"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tela</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 15.6" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="battery"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bateria</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 56Wh" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="os"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sistema Operacional</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Windows 11" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 1.8 kg" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dimensions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dimensões</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 35.8 x 23.8 x 1.8 cm" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-lg font-semibold pt-4 border-t">Características Adicionais</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="colors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cores Disponíveis</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Prata, Preto" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="warranty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Garantia</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 12 meses" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-lg font-semibold pt-4 border-t">Estoque e Status</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade em Estoque</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 0;
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <select
                        className="w-full h-10 pl-3 pr-10 border rounded-md"
                        {...field}
                      >
                        <option value="Ativo">Ativo</option>
                        <option value="Inativo">Inativo</option>
                        <option value="Estoque Baixo">Estoque Baixo</option>
                      </select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <div>
                <FormLabel className="block mb-2">Destaque</FormLabel>
                <select className="w-full h-10 pl-3 pr-10 border rounded-md">
                  <option value="Não">Não</option>
                  <option value="Sim">Sim</option>
                </select>
              </div>
            </div>

            <h3 className="text-lg font-semibold pt-4 border-t">Imagens do Produto</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormLabel className="block mb-2">Imagem Principal</FormLabel>
                <div className="flex items-center space-x-2">
                  <Input
                    type="file"
                    onChange={(e) => setMainImage(e.target.files?.[0] || null)}
                    className="flex-1"
                  />
                </div>
                {mainImage && (
                  <p className="text-sm text-gray-500 mt-1">
                    {mainImage.name}
                  </p>
                )}
              </div>
              <div>
                <FormLabel className="block mb-2">Imagens Adicionais (máx. 5)</FormLabel>
                <Input
                  type="file"
                  multiple
                  className="flex-1"
                />
              </div>
            </div>

            <h3 className="text-lg font-semibold pt-4 border-t">Descrições</h3>

            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição Curta</FormLabel>
                    <FormControl>
                      <textarea
                        className="w-full p-3 h-20 border rounded-md"
                        placeholder="Descrição breve do produto..."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fullDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição Completa</FormLabel>
                    <FormControl>
                      <textarea
                        className="w-full p-3 h-32 border rounded-md"
                        placeholder="Descrição detalhada do produto..."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                Salvar Produto
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;
