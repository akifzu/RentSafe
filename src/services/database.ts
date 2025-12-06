// ==============================================================================
// SEWASECURE DATABASE SERVICE
// Handles all Supabase database operations
// ==============================================================================

import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Property = Database['public']['Tables']['properties']['Row'];
type MoveInReport = Database['public']['Tables']['move_in_reports']['Row'];
type UtilityReading = Database['public']['Tables']['utility_readings']['Row'];

// ==============================================================================
// AUTHENTICATION
// ==============================================================================

export const auth = {
  // Sign up with email and password
  signUp: async (email: string, password: string, name: string, userType: 'tenant' | 'owner') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          user_type: userType
        }
      }
    });
    if (error) throw error;
    return data;
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current session
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  // Get current user
  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  }
};

// ==============================================================================
// PROFILES
// ==============================================================================

export const profiles = {
  // Get user profile
  get: async (userId: string): Promise<Profile | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update user profile
  update: async (userId: string, updates: Partial<Profile>) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// ==============================================================================
// PROPERTIES
// ==============================================================================

export const properties = {
  // Get all properties for current user
  getAll: async (userId: string): Promise<Property[]> => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get single property
  get: async (propertyId: string): Promise<Property | null> => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create new property
  create: async (property: Database['public']['Tables']['properties']['Insert']) => {
    const { data, error } = await supabase
      .from('properties')
      .insert(property)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update property
  update: async (propertyId: string, updates: Database['public']['Tables']['properties']['Update']) => {
    const { data, error } = await supabase
      .from('properties')
      .update(updates)
      .eq('id', propertyId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete property
  delete: async (propertyId: string) => {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', propertyId);
    
    if (error) throw error;
  }
};

// ==============================================================================
// MOVE-IN REPORTS
// ==============================================================================

export const moveInReports = {
  // Get all reports for a property
  getByProperty: async (propertyId: string): Promise<MoveInReport[]> => {
    const { data, error } = await supabase
      .from('move_in_reports')
      .select('*')
      .eq('property_id', propertyId)
      .order('submitted_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get all reports for current user
  getAll: async (userId: string): Promise<MoveInReport[]> => {
    const { data, error } = await supabase
      .from('move_in_reports')
      .select('*')
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false});
    
    if (error) throw error;
    return data || [];
  },

  // Create move-in report
  create: async (report: Database['public']['Tables']['move_in_reports']['Insert']) => {
    const { data, error } = await supabase
      .from('move_in_reports')
      .insert(report)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// ==============================================================================
// UTILITY READINGS
// ==============================================================================

export const utilityReadings = {
  // Get all readings for a property
  getByProperty: async (propertyId: string): Promise<UtilityReading[]> => {
    const { data, error } = await supabase
      .from('utility_readings')
      .select('*')
      .eq('property_id', propertyId)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get all readings for current user
  getAll: async (userId: string): Promise<UtilityReading[]> => {
    const { data, error } = await supabase
      .from('utility_readings')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Create utility reading
  create: async (reading: Database['public']['Tables']['utility_readings']['Insert']) => {
    const { data, error } = await supabase
      .from('utility_readings')
      .insert(reading)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update utility reading
  update: async (readingId: string, updates: Database['public']['Tables']['utility_readings']['Update']) => {
    const { data, error } = await supabase
      .from('utility_readings')
      .update(updates)
      .eq('id', readingId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete utility reading
  delete: async (readingId: string) => {
    const { error } = await supabase
      .from('utility_readings')
      .delete()
      .eq('id', readingId);
    
    if (error) throw error;
  }
};

// ==============================================================================
// STORAGE (File Uploads)
// ==============================================================================

export const storage = {
  // Upload property photo
  uploadPropertyPhoto: async (userId: string, propertyId: string, file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${propertyId}/${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('property-photos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) throw error;
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('property-photos')
      .getPublicUrl(fileName);
    
    return publicUrl;
  },

  // Upload receipt
  uploadReceipt: async (userId: string, propertyId: string, type: 'water' | 'electricity' | 'rent', file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${propertyId}/${type}-${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('receipts')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) throw error;
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('receipts')
      .getPublicUrl(fileName);
    
    return publicUrl;
  },

  // Upload tenancy agreement
  uploadAgreement: async (userId: string, propertyId: string, file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${propertyId}/agreement-${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('agreements')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) throw error;
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('agreements')
      .getPublicUrl(fileName);
    
    return publicUrl;
  }
};

// ==============================================================================
// REALTIME SUBSCRIPTIONS
// ==============================================================================

export const realtime = {
  // Subscribe to property changes
  subscribeToProperties: (userId: string, callback: (payload: any) => void) => {
    return supabase
      .channel('properties-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'properties',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe();
  },

  // Subscribe to utility readings changes
  subscribeToUtilityReadings: (propertyId: string, callback: (payload: any) => void) => {
    return supabase
      .channel('utility-readings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'utility_readings',
          filter: `property_id=eq.${propertyId}`
        },
        callback
      )
      .subscribe();
  }
};

