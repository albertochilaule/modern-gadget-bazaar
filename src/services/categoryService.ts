
import { supabase } from '@/utils/supabaseClient';

export const getAllCategories = async (): Promise<any[]> => {
  try {
    // Since we don't have a dedicated categories table in the provided schema,
    // we'll extract unique categories from products
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .order('category');
      
    if (error) {
      throw error;
    }
    
    // Extract unique categories and format them
    const uniqueCategories = Array.from(
      new Set(data.map(item => item.category))
    ).filter(Boolean);
    
    return uniqueCategories.map((name, index) => ({
      id: index + 1,
      name
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};
