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
      activity_log: {
        Row: {
          action: string
          id: number
          timestamp: string | null
          user_name: string
        }
        Insert: {
          action: string
          id?: number
          timestamp?: string | null
          user_name: string
        }
        Update: {
          action?: string
          id?: number
          timestamp?: string | null
          user_name?: string
        }
        Relationships: []
      }
      admin_settings: {
        Row: {
          id: number
          labor_percentage: number
          logo: string | null
          tax_percentage: number
          wastage_percentage: number
        }
        Insert: {
          id?: number
          labor_percentage: number
          logo?: string | null
          tax_percentage: number
          wastage_percentage: number
        }
        Update: {
          id?: number
          labor_percentage?: number
          logo?: string | null
          tax_percentage?: number
          wastage_percentage?: number
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          email: string
          id: number
          name: string
          role: string
          status: string
        }
        Insert: {
          email: string
          id?: number
          name: string
          role: string
          status: string
        }
        Update: {
          email?: string
          id?: number
          name?: string
          role?: string
          status?: string
        }
        Relationships: []
      }
      crm: {
        Row: {
          address: string | null
          customer_name: string
          email: string
          id: number
          interaction_notes: string | null
          phone_number: string | null
        }
        Insert: {
          address?: string | null
          customer_name: string
          email: string
          id?: number
          interaction_notes?: string | null
          phone_number?: string | null
        }
        Update: {
          address?: string | null
          customer_name?: string
          email?: string
          id?: number
          interaction_notes?: string | null
          phone_number?: string | null
        }
        Relationships: []
      }
      glass: {
        Row: {
          id: number
          rate: number
          thickness: number
          type: string
        }
        Insert: {
          id?: number
          rate: number
          thickness: number
          type: string
        }
        Update: {
          id?: number
          rate?: number
          thickness?: number
          type?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          base_rate: number
          category: string
          description: string | null
          id: number
          name: string
          series: string | null
          unit_type: string
        }
        Insert: {
          base_rate: number
          category: string
          description?: string | null
          id?: number
          name: string
          series?: string | null
          unit_type: string
        }
        Update: {
          base_rate?: number
          category?: string
          description?: string | null
          id?: number
          name?: string
          series?: string | null
          unit_type?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      series: {
        Row: {
          id: number
          material_rate: number
          name: string
          profile_weight: number
        }
        Insert: {
          id?: number
          material_rate: number
          name: string
          profile_weight: number
        }
        Update: {
          id?: number
          material_rate?: number
          name?: string
          profile_weight?: number
        }
        Relationships: []
      }
      transactions: {
        Row: {
          customer_name: string
          date: string
          id: number
          item_purchased: string
          quantity: number
          total: number
        }
        Insert: {
          customer_name: string
          date: string
          id?: number
          item_purchased: string
          quantity: number
          total: number
        }
        Update: {
          customer_name?: string
          date?: string
          id?: number
          item_purchased?: string
          quantity?: number
          total?: number
        }
        Relationships: []
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
