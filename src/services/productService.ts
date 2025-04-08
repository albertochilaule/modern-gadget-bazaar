
import { supabase } from '@/utils/supabaseClient';
import { Product } from '@/components/ProductCard';
import { DbProduct } from '@/types/supabase';

// Convert database product to frontend product
export const convertDbProductToProduct = (dbProduct: DbProduct): Product => {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    brand: dbProduct.brand,
    price: dbProduct.price.toString(), // Convert to string to match Product interface
    stock: dbProduct.stock,
    image: dbProduct.image || '/placeholder.svg',
    category: dbProduct.category,
    description: dbProduct.full_description || dbProduct.short_description || '',
    processor: dbProduct.processor,
    memory: dbProduct.memory,
    storage: dbProduct.storage,
    screenSize: dbProduct.screen_size,
    operatingSystem: dbProduct.operating_system,
    graphics: dbProduct.graphics
  };
};

// Fetch all products
export const fetchProducts = async (publishedOnly: boolean = false): Promise<Product[]> => {
  try {
    let query = supabase.from('products').select('*');
    
    if (publishedOnly) {
      query = query.eq('is_published', true);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    if (data && data.length > 0) {
      return data.map(convertDbProductToProduct);
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Fetch a single product by ID
export const fetchProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      // Try to find by code instead
      const { data: productsByCode, error: productsError } = await supabase
        .from('products')
        .select('*')
        .filter('id', 'ilike', `%${id}%`)
        .limit(1);
      
      if (!productsError && productsByCode?.length > 0) {
        return convertDbProductToProduct(productsByCode[0]);
      }
      
      throw error;
    }
    
    if (data) {
      return convertDbProductToProduct(data);
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};

// Create a new product
export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  try {
    const supabaseData = {
      name: product.name,
      brand: product.brand,
      category: product.category || '',
      price: Number(product.price), // Always convert price to number for database
      stock: product.stock,
      is_published: Boolean(product.isPublished),
      image: product.image,
      processor: product.processor,
      memory: product.memory,
      storage: product.storage,
      screen_size: product.screenSize,
      operating_system: product.operatingSystem,
      short_description: product.description,
      full_description: product.description
    };
    
    const { data, error } = await supabase
      .from('products')
      .insert(supabaseData)
      .select('*')
      .single();
      
    if (error) {
      throw error;
    }
    
    if (!data) {
      throw new Error('No data returned from insert operation');
    }
    
    return convertDbProductToProduct(data);
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Update an existing product
export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product> => {
  try {
    const supabaseData: any = {};
    
    // Map frontend properties to database columns
    if (product.name) supabaseData.name = product.name;
    if (product.brand) supabaseData.brand = product.brand;
    if (product.category) supabaseData.category = product.category;
    if (product.price !== undefined) supabaseData.price = Number(product.price); // Always convert to number
    if (product.stock !== undefined) supabaseData.stock = product.stock;
    if (product.isPublished !== undefined) supabaseData.is_published = product.isPublished;
    if (product.image) supabaseData.image = product.image;
    if (product.processor) supabaseData.processor = product.processor;
    if (product.memory) supabaseData.memory = product.memory;
    if (product.storage) supabaseData.storage = product.storage;
    if (product.screenSize) supabaseData.screen_size = product.screenSize;
    if (product.operatingSystem) supabaseData.operating_system = product.operatingSystem;
    if (product.description) {
      supabaseData.short_description = product.description;
      supabaseData.full_description = product.description;
    }
    
    const { data, error } = await supabase
      .from('products')
      .update(supabaseData)
      .eq('id', id)
      .select('*')
      .single();
      
    if (error) {
      throw error;
    }
    
    if (!data) {
      throw new Error('No data returned from update operation');
    }
    
    return convertDbProductToProduct(data);
  } catch (error) {
    console.error(`Error updating product with id ${id}:`, error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
      
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error(`Error deleting product with id ${id}:`, error);
    throw error;
  }
};

// Update product stock
export const updateProductStock = async (id: string, newStock: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('products')
      .update({ stock: newStock })
      .eq('id', id);
      
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error(`Error updating stock for product with id ${id}:`, error);
    throw error;
  }
};

// Record a sale
export const recordSale = async (
  productId: string, 
  customerName: string, 
  quantity: number, 
  totalPrice: number,
  userId?: string
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('sales')
      .insert({
        product_id: productId,
        customer_name: customerName,
        quantity,
        total_price: totalPrice,
        created_by: userId
      });
      
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error recording sale:', error);
    throw error;
  }
};
