
import { User as SupabaseUser } from '@supabase/supabase-js';

// Extend the Supabase User type to include profile information
export interface ExtendedUser extends SupabaseUser {
  name?: string;
}

// Database profile type
export interface Profile {
  id: string;
  name: string | null;
  email: string;
  role: 'admin' | 'colaborador' | 'cliente';
  last_access?: string;
  registration_date?: string;
  status: 'ativo' | 'inativo';
}

// Database product type
export interface DbProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  is_published: boolean;
  image?: string;
  processor?: string;
  memory?: string;
  storage?: string;
  screen_size?: string;
  operating_system?: string;
  graphics?: string;
  display?: string;
  battery?: string;
  weight?: string;
  dimensions?: string;
  colors?: string;
  warranty?: string;
  short_description?: string;
  full_description?: string;
  created_at: string;
  updated_at: string;
}

// Database sale type
export interface DbSale {
  id: string;
  product_id: string;
  customer_name: string;
  quantity: number;
  total_price: number;
  sale_date: string;
  created_by?: string;
}
