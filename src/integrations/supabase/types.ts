export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          battery: string | null
          brand: string
          category: string
          colors: string | null
          created_at: string
          dimensions: string | null
          display: string | null
          full_description: string | null
          graphics: string | null
          id: string
          image: string | null
          is_published: boolean
          memory: string | null
          name: string
          operating_system: string | null
          price: number
          processor: string | null
          screen_size: string | null
          short_description: string | null
          status: string
          stock: number
          storage: string | null
          updated_at: string
          warranty: string | null
          weight: string | null
        }
        Insert: {
          battery?: string | null
          brand: string
          category: string
          colors?: string | null
          created_at?: string
          dimensions?: string | null
          display?: string | null
          full_description?: string | null
          graphics?: string | null
          id?: string
          image?: string | null
          is_published?: boolean
          memory?: string | null
          name: string
          operating_system?: string | null
          price: number
          processor?: string | null
          screen_size?: string | null
          short_description?: string | null
          status?: string
          stock?: number
          storage?: string | null
          updated_at?: string
          warranty?: string | null
          weight?: string | null
        }
        Update: {
          battery?: string | null
          brand?: string
          category?: string
          colors?: string | null
          created_at?: string
          dimensions?: string | null
          display?: string | null
          full_description?: string | null
          graphics?: string | null
          id?: string
          image?: string | null
          is_published?: boolean
          memory?: string | null
          name?: string
          operating_system?: string | null
          price?: number
          processor?: string | null
          screen_size?: string | null
          short_description?: string | null
          status?: string
          stock?: number
          storage?: string | null
          updated_at?: string
          warranty?: string | null
          weight?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          email: string
          id: string
          last_access: string | null
          name: string | null
          registration_date: string
          role: string
          status: string
        }
        Insert: {
          email: string
          id: string
          last_access?: string | null
          name?: string | null
          registration_date?: string
          role?: string
          status?: string
        }
        Update: {
          email?: string
          id?: string
          last_access?: string | null
          name?: string | null
          registration_date?: string
          role?: string
          status?: string
        }
        Relationships: []
      }
      sales: {
        Row: {
          created_by: string | null
          customer_name: string
          id: string
          product_id: string | null
          quantity: number
          sale_date: string
          total_price: number
        }
        Insert: {
          created_by?: string | null
          customer_name: string
          id?: string
          product_id?: string | null
          quantity: number
          sale_date?: string
          total_price: number
        }
        Update: {
          created_by?: string | null
          customer_name?: string
          id?: string
          product_id?: string | null
          quantity?: number
          sale_date?: string
          total_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "sales_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
