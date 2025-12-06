// ==============================================================================
// SUPABASE DATABASE TYPES
// Auto-generated types for TypeScript safety
// ==============================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          user_type: 'tenant' | 'owner'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          user_type: 'tenant' | 'owner'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          user_type?: 'tenant' | 'owner'
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          user_id: string
          property_address: string
          renter_name: string
          renter_email: string
          move_in_date: string
          status: 'pending' | 'report-submitted' | 'active'
          tenancy_agreement_url: string | null
          owner_email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          property_address: string
          renter_name: string
          renter_email: string
          move_in_date: string
          status?: 'pending' | 'report-submitted' | 'active'
          tenancy_agreement_url?: string | null
          owner_email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          property_address?: string
          renter_name?: string
          renter_email?: string
          move_in_date?: string
          status?: 'pending' | 'report-submitted' | 'active'
          tenancy_agreement_url?: string | null
          owner_email?: string
          created_at?: string
          updated_at?: string
        }
      }
      move_in_reports: {
        Row: {
          id: string
          property_id: string
          user_id: string
          rooms: Json
          submitted_at: string
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          user_id: string
          rooms: Json
          submitted_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          user_id?: string
          rooms?: Json
          submitted_at?: string
          created_at?: string
        }
      }
      utility_readings: {
        Row: {
          id: string
          property_id: string
          user_id: string
          date: string
          water: number
          electricity: number
          rent: number
          water_receipt_url: string | null
          electricity_receipt_url: string | null
          rent_receipt_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          user_id: string
          date: string
          water: number
          electricity: number
          rent: number
          water_receipt_url?: string | null
          electricity_receipt_url?: string | null
          rent_receipt_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          user_id?: string
          date?: string
          water?: number
          electricity?: number
          rent?: number
          water_receipt_url?: string | null
          electricity_receipt_url?: string | null
          rent_receipt_url?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_type: 'tenant' | 'owner'
      property_status: 'pending' | 'report-submitted' | 'active'
    }
  }
}

