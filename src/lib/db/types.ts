export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      judge_scores: {
        Row: {
          created_at: string
          execution: number
          id: string
          judge: string
          notes: string | null
          privacy_impact: number
          project_fit: number
          submission_id: string
          updated_at: string
          ux_presentation: number
        }
        Insert: {
          created_at?: string
          execution: number
          id?: string
          judge: string
          notes?: string | null
          privacy_impact: number
          project_fit: number
          submission_id: string
          updated_at?: string
          ux_presentation: number
        }
        Update: {
          created_at?: string
          execution?: number
          id?: string
          judge?: string
          notes?: string | null
          privacy_impact?: number
          project_fit?: number
          submission_id?: string
          updated_at?: string
          ux_presentation?: number
        }
        Relationships: [
          {
            foreignKeyName: "judge_scores_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          accepted_rules: boolean
          admin_notes: string | null
          category: string
          colosseum_url: string | null
          contact_email: string
          contact_name: string
          contact_telegram: string | null
          contact_whatsapp: string | null
          created_at: string
          demo_video_url: string
          edit_token_hash: string
          id: string
          ip_hash: string | null
          is_winner: boolean
          members: Json
          number: number
          payout_status: string
          prize_pool: string | null
          project_name: string
          proof_type: string
          proof_value: string
          repo_url: string
          show_members: boolean
          slug: string
          sprint_changes: string
          status: string
          tagline: string
          team_name: string | null
          tech: string
          updated_at: string
          website_url: string | null
          writeup: string
        }
        Insert: {
          accepted_rules: boolean
          admin_notes?: string | null
          category: string
          colosseum_url?: string | null
          contact_email: string
          contact_name: string
          contact_telegram?: string | null
          contact_whatsapp?: string | null
          created_at?: string
          demo_video_url: string
          edit_token_hash: string
          id?: string
          ip_hash?: string | null
          is_winner?: boolean
          members?: Json
          number?: number
          payout_status?: string
          prize_pool?: string | null
          project_name: string
          proof_type: string
          proof_value: string
          repo_url: string
          show_members?: boolean
          slug: string
          sprint_changes: string
          status?: string
          tagline: string
          team_name?: string | null
          tech: string
          updated_at?: string
          website_url?: string | null
          writeup: string
        }
        Update: {
          accepted_rules?: boolean
          admin_notes?: string | null
          category?: string
          colosseum_url?: string | null
          contact_email?: string
          contact_name?: string
          contact_telegram?: string | null
          contact_whatsapp?: string | null
          created_at?: string
          demo_video_url?: string
          edit_token_hash?: string
          id?: string
          ip_hash?: string | null
          is_winner?: boolean
          members?: Json
          number?: number
          payout_status?: string
          prize_pool?: string | null
          project_name?: string
          proof_type?: string
          proof_value?: string
          repo_url?: string
          show_members?: boolean
          slug?: string
          sprint_changes?: string
          status?: string
          tagline?: string
          team_name?: string | null
          tech?: string
          updated_at?: string
          website_url?: string | null
          writeup?: string
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

