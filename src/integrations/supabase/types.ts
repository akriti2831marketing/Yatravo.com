export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      assistant_conversations: {
        Row: {
          created_at: string
          destination: string | null
          id: string
          messages: Json
          state: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          destination?: string | null
          id?: string
          messages?: Json
          state?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          destination?: string | null
          id?: string
          messages?: Json
          state?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      creator_followers: {
        Row: {
          creator_id: string
          followed_at: string
          follower_user_id: string
          id: string
        }
        Insert: {
          creator_id: string
          followed_at?: string
          follower_user_id: string
          id?: string
        }
        Update: {
          creator_id?: string
          followed_at?: string
          follower_user_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "creator_followers_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_profile_views: {
        Row: {
          creator_id: string
          id: string
          viewed_at: string
          viewer_user_id: string | null
        }
        Insert: {
          creator_id: string
          id?: string
          viewed_at?: string
          viewer_user_id?: string | null
        }
        Update: {
          creator_id?: string
          id?: string
          viewed_at?: string
          viewer_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_profile_views_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_profiles: {
        Row: {
          allow_join_requests: boolean
          bio: string | null
          commitment_agreed: boolean
          commitment_agreed_at: string | null
          content_styles: string[] | null
          cover_photo_url: string | null
          created_at: string
          creator_name: string
          handle: string
          id: string
          instagram_connected_at: string | null
          instagram_followers: number | null
          instagram_profile_pic: string | null
          instagram_username: string | null
          primary_platform: string | null
          profile_views: number
          show_instagram_count: boolean
          show_upcoming_trips: boolean
          updated_at: string
          user_id: string
          verified_at: string | null
          verified_creator: boolean
          website_url: string | null
          years_travelling: string | null
          youtube_subscribers: number | null
          youtube_username: string | null
        }
        Insert: {
          allow_join_requests?: boolean
          bio?: string | null
          commitment_agreed?: boolean
          commitment_agreed_at?: string | null
          content_styles?: string[] | null
          cover_photo_url?: string | null
          created_at?: string
          creator_name: string
          handle: string
          id?: string
          instagram_connected_at?: string | null
          instagram_followers?: number | null
          instagram_profile_pic?: string | null
          instagram_username?: string | null
          primary_platform?: string | null
          profile_views?: number
          show_instagram_count?: boolean
          show_upcoming_trips?: boolean
          updated_at?: string
          user_id: string
          verified_at?: string | null
          verified_creator?: boolean
          website_url?: string | null
          years_travelling?: string | null
          youtube_subscribers?: number | null
          youtube_username?: string | null
        }
        Update: {
          allow_join_requests?: boolean
          bio?: string | null
          commitment_agreed?: boolean
          commitment_agreed_at?: string | null
          content_styles?: string[] | null
          cover_photo_url?: string | null
          created_at?: string
          creator_name?: string
          handle?: string
          id?: string
          instagram_connected_at?: string | null
          instagram_followers?: number | null
          instagram_profile_pic?: string | null
          instagram_username?: string | null
          primary_platform?: string | null
          profile_views?: number
          show_instagram_count?: boolean
          show_upcoming_trips?: boolean
          updated_at?: string
          user_id?: string
          verified_at?: string | null
          verified_creator?: boolean
          website_url?: string | null
          years_travelling?: string | null
          youtube_subscribers?: number | null
          youtube_username?: string | null
        }
        Relationships: []
      }
      creator_trails: {
        Row: {
          best_seasons: string[] | null
          created_at: string
          description: string | null
          difficulty: string | null
          duration_days: number | null
          id: string
          is_public: boolean
          name: string
          raahi_id: string
          save_count: number
          updated_at: string
        }
        Insert: {
          best_seasons?: string[] | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          duration_days?: number | null
          id?: string
          is_public?: boolean
          name: string
          raahi_id: string
          save_count?: number
          updated_at?: string
        }
        Update: {
          best_seasons?: string[] | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          duration_days?: number | null
          id?: string
          is_public?: boolean
          name?: string
          raahi_id?: string
          save_count?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "creator_trails_raahi_id_fkey"
            columns: ["raahi_id"]
            isOneToOne: false
            referencedRelation: "raahi_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          user_id?: string
        }
        Relationships: []
      }
      raahi_followers: {
        Row: {
          followed_at: string
          follower_user_id: string
          id: string
          raahi_id: string
        }
        Insert: {
          followed_at?: string
          follower_user_id: string
          id?: string
          raahi_id: string
        }
        Update: {
          followed_at?: string
          follower_user_id?: string
          id?: string
          raahi_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "raahi_followers_raahi_id_fkey"
            columns: ["raahi_id"]
            isOneToOne: false
            referencedRelation: "raahi_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      raahi_profile_views: {
        Row: {
          id: string
          raahi_id: string
          viewed_at: string
          viewer_user_id: string | null
        }
        Insert: {
          id?: string
          raahi_id: string
          viewed_at?: string
          viewer_user_id?: string | null
        }
        Update: {
          id?: string
          raahi_id?: string
          viewed_at?: string
          viewer_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "raahi_profile_views_raahi_id_fkey"
            columns: ["raahi_id"]
            isOneToOne: false
            referencedRelation: "raahi_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      raahi_profiles: {
        Row: {
          allow_join_requests: boolean
          bio: string | null
          commitment_agreed: boolean
          commitment_agreed_at: string | null
          content_styles: string[] | null
          cover_photo_url: string | null
          created_at: string
          handle: string
          id: string
          instagram_url: string | null
          other_url: string | null
          profile_views: number
          raahi_name: string
          show_upcoming_trips: boolean
          updated_at: string
          user_id: string
          verified_at: string | null
          verified_raahi: boolean
          website_url: string | null
          years_travelling: string | null
          youtube_url: string | null
        }
        Insert: {
          allow_join_requests?: boolean
          bio?: string | null
          commitment_agreed?: boolean
          commitment_agreed_at?: string | null
          content_styles?: string[] | null
          cover_photo_url?: string | null
          created_at?: string
          handle: string
          id?: string
          instagram_url?: string | null
          other_url?: string | null
          profile_views?: number
          raahi_name: string
          show_upcoming_trips?: boolean
          updated_at?: string
          user_id: string
          verified_at?: string | null
          verified_raahi?: boolean
          website_url?: string | null
          years_travelling?: string | null
          youtube_url?: string | null
        }
        Update: {
          allow_join_requests?: boolean
          bio?: string | null
          commitment_agreed?: boolean
          commitment_agreed_at?: string | null
          content_styles?: string[] | null
          cover_photo_url?: string | null
          created_at?: string
          handle?: string
          id?: string
          instagram_url?: string | null
          other_url?: string | null
          profile_views?: number
          raahi_name?: string
          show_upcoming_trips?: boolean
          updated_at?: string
          user_id?: string
          verified_at?: string | null
          verified_raahi?: boolean
          website_url?: string | null
          years_travelling?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      raahi_trip_join_requests: {
        Row: {
          id: string
          raahi_id: string
          requested_at: string
          requester_user_id: string
          responded_at: string | null
          status: string
          trip_id: string
        }
        Insert: {
          id?: string
          raahi_id: string
          requested_at?: string
          requester_user_id: string
          responded_at?: string | null
          status?: string
          trip_id: string
        }
        Update: {
          id?: string
          raahi_id?: string
          requested_at?: string
          requester_user_id?: string
          responded_at?: string | null
          status?: string
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "raahi_trip_join_requests_raahi_id_fkey"
            columns: ["raahi_id"]
            isOneToOne: false
            referencedRelation: "raahi_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "raahi_trip_join_requests_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trail_saves: {
        Row: {
          id: string
          saved_at: string
          trail_id: string
          user_id: string
        }
        Insert: {
          id?: string
          saved_at?: string
          trail_id: string
          user_id: string
        }
        Update: {
          id?: string
          saved_at?: string
          trail_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trail_saves_trail_id_fkey"
            columns: ["trail_id"]
            isOneToOne: false
            referencedRelation: "creator_trails"
            referencedColumns: ["id"]
          },
        ]
      }
      trail_stops: {
        Row: {
          created_at: string
          days_recommended: number | null
          destination: string
          id: string
          photo_url: string | null
          raahi_note: string | null
          state: string | null
          stop_order: number
          trail_id: string
          trip_id: string | null
        }
        Insert: {
          created_at?: string
          days_recommended?: number | null
          destination: string
          id?: string
          photo_url?: string | null
          raahi_note?: string | null
          state?: string | null
          stop_order: number
          trail_id: string
          trip_id?: string | null
        }
        Update: {
          created_at?: string
          days_recommended?: number | null
          destination?: string
          id?: string
          photo_url?: string | null
          raahi_note?: string | null
          state?: string | null
          stop_order?: number
          trail_id?: string
          trip_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trail_stops_trail_id_fkey"
            columns: ["trail_id"]
            isOneToOne: false
            referencedRelation: "creator_trails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trail_stops_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_confirmations: {
        Row: {
          confirmation_type: string | null
          confirmed_by_user_id: string
          created_at: string
          id: string
          trip_id: string
        }
        Insert: {
          confirmation_type?: string | null
          confirmed_by_user_id: string
          created_at?: string
          id?: string
          trip_id: string
        }
        Update: {
          confirmation_type?: string | null
          confirmed_by_user_id?: string
          created_at?: string
          id?: string
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_confirmations_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_join_requests: {
        Row: {
          creator_id: string
          id: string
          requested_at: string
          requester_user_id: string
          responded_at: string | null
          status: string
          trip_id: string
        }
        Insert: {
          creator_id: string
          id?: string
          requested_at?: string
          requester_user_id: string
          responded_at?: string | null
          status?: string
          trip_id: string
        }
        Update: {
          creator_id?: string
          id?: string
          requested_at?: string
          requester_user_id?: string
          responded_at?: string | null
          status?: string
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_join_requests_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_join_requests_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          best_photo_url: string | null
          budget_tier: string | null
          created_at: string
          destination: string
          destination_type: string | null
          end_date: string
          gmail_verified: boolean
          id: string
          is_public: boolean
          logged_via: string
          mood_tags: string[] | null
          note: string | null
          photo_urls: string[] | null
          start_date: string
          state: string | null
          travel_style: string | null
          trip_type: string
          user_id: string
        }
        Insert: {
          best_photo_url?: string | null
          budget_tier?: string | null
          created_at?: string
          destination: string
          destination_type?: string | null
          end_date: string
          gmail_verified?: boolean
          id?: string
          is_public?: boolean
          logged_via?: string
          mood_tags?: string[] | null
          note?: string | null
          photo_urls?: string[] | null
          start_date: string
          state?: string | null
          travel_style?: string | null
          trip_type?: string
          user_id: string
        }
        Update: {
          best_photo_url?: string | null
          budget_tier?: string | null
          created_at?: string
          destination?: string
          destination_type?: string | null
          end_date?: string
          gmail_verified?: boolean
          id?: string
          is_public?: boolean
          logged_via?: string
          mood_tags?: string[] | null
          note?: string | null
          photo_urls?: string[] | null
          start_date?: string
          state?: string | null
          travel_style?: string | null
          trip_type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_trust_scores: {
        Row: {
          last_calculated: string
          trust_score: number
          user_id: string
        }
        Insert: {
          last_calculated?: string
          trust_score?: number
          user_id: string
        }
        Update: {
          last_calculated?: string
          trust_score?: number
          user_id?: string
        }
        Relationships: []
      }
      vendor_creator_endorsements: {
        Row: {
          created_at: string
          creator_confirmed: boolean
          creator_id: string
          id: string
          stay_month: string | null
          stay_year: number | null
          trip_id: string | null
          vendor_id: string
        }
        Insert: {
          created_at?: string
          creator_confirmed?: boolean
          creator_id: string
          id?: string
          stay_month?: string | null
          stay_year?: number | null
          trip_id?: string | null
          vendor_id: string
        }
        Update: {
          created_at?: string
          creator_confirmed?: boolean
          creator_id?: string
          id?: string
          stay_month?: string | null
          stay_year?: number | null
          trip_id?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_creator_endorsements_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_creator_endorsements_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_raahi_endorsements: {
        Row: {
          created_at: string
          id: string
          raahi_confirmed: boolean
          raahi_id: string
          stay_month: string | null
          stay_year: number | null
          trip_id: string | null
          vendor_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          raahi_confirmed?: boolean
          raahi_id: string
          stay_month?: string | null
          stay_year?: number | null
          trip_id?: string | null
          vendor_id: string
        }
        Update: {
          created_at?: string
          id?: string
          raahi_confirmed?: boolean
          raahi_id?: string
          stay_month?: string | null
          stay_year?: number | null
          trip_id?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_raahi_endorsements_raahi_id_fkey"
            columns: ["raahi_id"]
            isOneToOne: false
            referencedRelation: "raahi_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_raahi_endorsements_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
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
  public: {
    Enums: {},
  },
} as const
