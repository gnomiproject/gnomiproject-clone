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
      archetype_data_041624bw: {
        Row: {
          achetype_family: string | null
          "Archetype Average": number | null
          "Archetype Value": number | null
          archetype_ID: string | null
          archetype_name: string | null
          Category: string | null
          Difference: number | null
          industries: string | null
          key: number
          Metric: string | null
        }
        Insert: {
          achetype_family?: string | null
          "Archetype Average"?: number | null
          "Archetype Value"?: number | null
          archetype_ID?: string | null
          archetype_name?: string | null
          Category?: string | null
          Difference?: number | null
          industries?: string | null
          key: number
          Metric?: string | null
        }
        Update: {
          achetype_family?: string | null
          "Archetype Average"?: number | null
          "Archetype Value"?: number | null
          archetype_ID?: string | null
          archetype_name?: string | null
          Category?: string | null
          Difference?: number | null
          industries?: string | null
          key?: number
          Metric?: string | null
        }
        Relationships: []
      }
      archetype_families: {
        Row: {
          common_traits: Json
          description: string
          id: string
          name: string
        }
        Insert: {
          common_traits: Json
          description: string
          id: string
          name: string
        }
        Update: {
          common_traits?: Json
          description?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      archetype_metrics: {
        Row: {
          archetype_id: string
          average_family_size: number
          emergency_visits_per_1k: number
          inpatient_admits_per_1k: number
          paid_allowed_ratio: number
          paid_pepy: number
          paid_pepy_variance: number
          paid_pmpy: number
          paid_pmpy_variance: number
          risk_cost_ratio: number
          sdoh_score: number
          specialist_visits_per_1k: number
        }
        Insert: {
          archetype_id: string
          average_family_size: number
          emergency_visits_per_1k: number
          inpatient_admits_per_1k: number
          paid_allowed_ratio: number
          paid_pepy: number
          paid_pepy_variance: number
          paid_pmpy: number
          paid_pmpy_variance: number
          risk_cost_ratio: number
          sdoh_score: number
          specialist_visits_per_1k: number
        }
        Update: {
          archetype_id?: string
          average_family_size?: number
          emergency_visits_per_1k?: number
          inpatient_admits_per_1k?: number
          paid_allowed_ratio?: number
          paid_pepy?: number
          paid_pepy_variance?: number
          paid_pmpy?: number
          paid_pmpy_variance?: number
          risk_cost_ratio?: number
          sdoh_score?: number
          specialist_visits_per_1k?: number
        }
        Relationships: [
          {
            foreignKeyName: "archetype_metrics_archetype_id_fkey"
            columns: ["archetype_id"]
            isOneToOne: true
            referencedRelation: "archetypes"
            referencedColumns: ["id"]
          },
        ]
      }
      archetypes: {
        Row: {
          characteristics: Json
          color: string
          family_id: string
          hex_color: string | null
          id: string
          long_description: string
          name: string
          primary_risk_driver: string
          risk_score: number
          risk_variance: number
          short_description: string
          strategic_priorities: Json
        }
        Insert: {
          characteristics: Json
          color: string
          family_id: string
          hex_color?: string | null
          id: string
          long_description: string
          name: string
          primary_risk_driver: string
          risk_score: number
          risk_variance: number
          short_description: string
          strategic_priorities: Json
        }
        Update: {
          characteristics?: Json
          color?: string
          family_id?: string
          hex_color?: string | null
          id?: string
          long_description?: string
          name?: string
          primary_risk_driver?: string
          risk_score?: number
          risk_variance?: number
          short_description?: string
          strategic_priorities?: Json
        }
        Relationships: [
          {
            foreignKeyName: "archetypes_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "archetype_families"
            referencedColumns: ["id"]
          },
        ]
      }
      archetypes_detailed: {
        Row: {
          color: string
          enhanced: Json
          family_id: string
          family_name: string
          hex_color: string | null
          id: string
          name: string
          standard: Json
          summary: Json
        }
        Insert: {
          color: string
          enhanced: Json
          family_id: string
          family_name: string
          hex_color?: string | null
          id: string
          name: string
          standard: Json
          summary: Json
        }
        Update: {
          color?: string
          enhanced?: Json
          family_id?: string
          family_name?: string
          hex_color?: string | null
          id?: string
          name?: string
          standard?: Json
          summary?: Json
        }
        Relationships: [
          {
            foreignKeyName: "archetypes_detailed_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "archetype_families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "archetypes_detailed_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "archetypes"
            referencedColumns: ["id"]
          },
        ]
      }
      distinctive_traits: {
        Row: {
          archetype_id: string
          disease_patterns: Json
          unique_insights: Json
          utilization_patterns: Json
        }
        Insert: {
          archetype_id: string
          disease_patterns: Json
          unique_insights: Json
          utilization_patterns: Json
        }
        Update: {
          archetype_id?: string
          disease_patterns?: Json
          unique_insights?: Json
          utilization_patterns?: Json
        }
        Relationships: [
          {
            foreignKeyName: "distinctive_traits_archetype_id_fkey"
            columns: ["archetype_id"]
            isOneToOne: true
            referencedRelation: "archetypes"
            referencedColumns: ["id"]
          },
        ]
      }
      report_requests: {
        Row: {
          access_token: string
          archetype_id: string
          assessment_answers: Json | null
          assessment_result: Json | null
          comments: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          name: string
          organization: string
          status: string
        }
        Insert: {
          access_token?: string
          archetype_id: string
          assessment_answers?: Json | null
          assessment_result?: Json | null
          comments?: string | null
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          name: string
          organization: string
          status?: string
        }
        Update: {
          access_token?: string
          archetype_id?: string
          assessment_answers?: Json | null
          assessment_result?: Json | null
          comments?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          name?: string
          organization?: string
          status?: string
        }
        Relationships: []
      }
    }
    Views: {
      archetype_distinctive_metrics: {
        Row: {
          "Archetype Average": number | null
          "Archetype Value": number | null
          archetype_ID: string | null
          Category: string | null
          Difference: number | null
          Metric: string | null
        }
        Insert: {
          "Archetype Average"?: number | null
          "Archetype Value"?: number | null
          archetype_ID?: string | null
          Category?: string | null
          Difference?: number | null
          Metric?: string | null
        }
        Update: {
          "Archetype Average"?: number | null
          "Archetype Value"?: number | null
          archetype_ID?: string | null
          Category?: string | null
          Difference?: number | null
          Metric?: string | null
        }
        Relationships: []
      }
      archetype_info: {
        Row: {
          achetype_family: string | null
          archetype_name: string | null
          industries: string | null
          key: number | null
        }
        Relationships: []
      }
      archetype_key_metrics: {
        Row: {
          "Archetype Average": number | null
          "Archetype Value": number | null
          archetype_ID: string | null
          Category: string | null
          Difference: number | null
          Metric: string | null
        }
        Insert: {
          "Archetype Average"?: number | null
          "Archetype Value"?: number | null
          archetype_ID?: string | null
          Category?: string | null
          Difference?: number | null
          Metric?: string | null
        }
        Update: {
          "Archetype Average"?: number | null
          "Archetype Value"?: number | null
          archetype_ID?: string | null
          Category?: string | null
          Difference?: number | null
          Metric?: string | null
        }
        Relationships: []
      }
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
