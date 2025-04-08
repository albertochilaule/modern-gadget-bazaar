
// This file helps with better TypeScript type definitions for Supabase
import { SupabaseClient } from '@supabase/supabase-js';
import { DbProduct, DbSale, Profile } from '@/types/supabase';

// Type-safe table definitions
interface Database {
  public: {
    Tables: {
      products: {
        Row: DbProduct;
        Insert: Omit<DbProduct, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DbProduct, 'id' | 'created_at' | 'updated_at'>>;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'registration_date'>;
        Update: Partial<Omit<Profile, 'id' | 'registration_date'>>;
      };
      sales: {
        Row: DbSale;
        Insert: Omit<DbSale, 'id' | 'sale_date'>;
        Update: Partial<Omit<DbSale, 'id' | 'sale_date'>>;
      };
    };
  };
}

export const createTypedSupabaseClient = (client: SupabaseClient) => {
  return client as SupabaseClient<Database>;
};

export const typedSupabaseClient = (client: SupabaseClient) => {
  return client.from as SupabaseClient<Database>['from'];
};
