
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/utils/supabaseClient';
import { Product, determineStatus } from '@/types/product';

export const useProductManagement = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      if (data) {
        const formattedProducts = data.map(product => ({
          id: product.id,
          name: product.name,
          brand: product.brand,
          category: product.category,
          price: product.price.toString(),
          stock: product.stock,
          status: determineStatus(product.stock),
          isPublished: product.is_published,
          image: product.image || '/placeholder.svg',
          processor: product.processor,
          memory: product.memory,
          storage: product.storage,
          screenSize: product.screen_size,
          operatingSystem: product.operating_system,
          graphics: product.graphics
        }));
        
        setProducts(formattedProducts);
        localStorage.setItem('adminProducts', JSON.stringify(formattedProducts));
      } else {
        const stored = localStorage.getItem('adminProducts');
        if (stored) {
          setProducts(JSON.parse(stored));
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Erro ao carregar produtos',
        description: 'Não foi possível carregar os produtos. Tente novamente mais tarde.',
        variant: 'destructive'
      });
      
      const stored = localStorage.getItem('adminProducts');
      if (stored) {
        setProducts(JSON.parse(stored));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .match({ id });
          
        if (error) throw error;
        
        setProducts(products.filter(product => product.id !== id));
        localStorage.setItem('adminProducts', JSON.stringify(products.filter(product => product.id !== id)));
        
        toast({
          title: "Produto removido",
          description: "O produto foi removido com sucesso."
        });
      } catch (error) {
        console.error('Error deleting product:', error);
        toast({
          title: 'Erro ao excluir produto',
          description: 'Não foi possível excluir o produto. Tente novamente mais tarde.',
          variant: 'destructive'
        });
      }
    }
  };

  const handleToggleVisibility = async (product: Product) => {
    try {
      const newIsPublished = !product.isPublished;
      
      const { error } = await supabase
        .from('products')
        .update({ is_published: newIsPublished })
        .match({ id: product.id });
        
      if (error) throw error;
      
      const updatedProducts = products.map(p => 
        p.id === product.id ? { ...p, isPublished: newIsPublished } : p
      );
      setProducts(updatedProducts);
      localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
      
      toast({
        title: product.isPublished ? "Produto ocultado" : "Produto publicado",
        description: `O produto foi ${product.isPublished ? 'ocultado do' : 'publicado para o'} público com sucesso.`,
        variant: "success"
      });
    } catch (error) {
      console.error('Error updating product visibility:', error);
      toast({
        title: 'Erro ao alterar visibilidade',
        description: 'Não foi possível alterar a visibilidade do produto. Tente novamente mais tarde.',
        variant: 'destructive'
      });
    }
  };

  const handleAddProduct = async (product: Omit<Product, 'id' | 'status'>) => {
    try {
      const status = determineStatus(product.stock);
      
      const supabaseData = {
        name: product.name,
        brand: product.brand,
        category: product.category,
        price: Number(product.price),
        stock: product.stock,
        is_published: product.is_published !== undefined ? product.is_published : true,
        image: product.image,
        processor: product.processor,
        memory: product.memory,
        storage: product.storage,
        screen_size: product.screenSize || product.screen_size,
        operating_system: product.operatingSystem || product.operating_system,
        graphics: product.graphics
      };
      
      const { data, error } = await supabase
        .from('products')
        .insert(supabaseData)
        .select('*')
        .single();
        
      if (error) throw error;
      
      if (!data) {
        throw new Error('No data returned from insert operation');
      }
      
      const newProduct: Product = {
        id: data.id,
        name: data.name,
        brand: data.brand,
        category: data.category,
        price: data.price.toString(),
        stock: data.stock,
        status,
        isPublished: data.is_published,
        image: data.image || '/placeholder.svg',
        processor: data.processor,
        memory: data.memory,
        storage: data.storage,
        screenSize: data.screen_size,
        operatingSystem: data.operating_system,
        graphics: data.graphics
      };
      
      setProducts([...products, newProduct]);
      localStorage.setItem('adminProducts', JSON.stringify([...products, newProduct]));
      
      toast({
        title: "Produto adicionado",
        description: "O novo produto foi adicionado com sucesso."
      });
      
      return true;
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: 'Erro ao adicionar produto',
        description: 'Não foi possível adicionar o produto. Tente novamente mais tarde.',
        variant: 'destructive'
      });
      return false;
    }
  };
  
  const handleEditProduct = async (updatedProduct: Product) => {
    try {
      const status = determineStatus(updatedProduct.stock);
      
      const supabaseData = {
        name: updatedProduct.name,
        brand: updatedProduct.brand,
        category: updatedProduct.category,
        price: Number(updatedProduct.price),
        stock: updatedProduct.stock,
        is_published: updatedProduct.isPublished,
        image: updatedProduct.image,
        processor: updatedProduct.processor,
        memory: updatedProduct.memory,
        storage: updatedProduct.storage,
        screen_size: updatedProduct.screenSize || updatedProduct.screen_size,
        operating_system: updatedProduct.operatingSystem || updatedProduct.operating_system,
        graphics: updatedProduct.graphics
      };
      
      const { error } = await supabase
        .from('products')
        .update(supabaseData)
        .match({ id: updatedProduct.id });
        
      if (error) throw error;
      
      const productWithStatus = {
        ...updatedProduct,
        status
      };
      
      setProducts(products.map(product => 
        product.id === updatedProduct.id ? productWithStatus : product
      ));
      
      localStorage.setItem('adminProducts', JSON.stringify(
        products.map(product => product.id === updatedProduct.id ? productWithStatus : product)
      ));
      
      toast({
        title: "Produto atualizado",
        description: "O produto foi atualizado com sucesso."
      });
      
      return true;
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: 'Erro ao atualizar produto',
        description: 'Não foi possível atualizar o produto. Tente novamente mais tarde.',
        variant: 'destructive'
      });
      return false;
    }
  };

  const handleSale = async (saleData: any) => {
    try {
      const productIndex = products.findIndex(p => p.id === saleData.productId);
      if (productIndex >= 0) {
        const newStock = Math.max(0, products[productIndex].stock - saleData.quantity);
        const newStatus = determineStatus(newStock);
        
        const { error: updateError } = await supabase
          .from('products')
          .update({ stock: newStock })
          .match({ id: saleData.productId });
          
        if (updateError) throw updateError;
        
        const { error: saleError } = await supabase
          .from('sales')
          .insert({
            product_id: saleData.productId,
            customer_name: saleData.customerName,
            quantity: saleData.quantity,
            total_price: saleData.totalPrice || Number(products[productIndex].price) * saleData.quantity,
            created_by: (await supabase.auth.getUser()).data.user?.id
          });
          
        if (saleError) throw saleError;
        
        const updatedProducts = [...products];
        updatedProducts[productIndex] = {
          ...updatedProducts[productIndex],
          stock: newStock,
          status: newStatus
        };
        
        setProducts(updatedProducts);
        
        localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
        
        toast({
          title: "Venda registrada",
          description: `Venda de ${saleData.quantity} unidades para ${saleData.customerName} registrada com sucesso.`
        });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error recording sale:', error);
      toast({
        title: 'Erro ao registrar venda',
        description: 'Não foi possível registrar a venda. Tente novamente mais tarde.',
        variant: 'destructive'
      });
      return false;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    isLoading,
    fetchProducts,
    handleDelete,
    handleToggleVisibility,
    handleAddProduct,
    handleEditProduct,
    handleSale
  };
};
