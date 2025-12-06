-- ==============================================================================
-- SEWASECURE DATABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_type AS ENUM ('tenant', 'owner');
CREATE TYPE property_status AS ENUM ('pending', 'report-submitted', 'active');

-- ==============================================================================
-- PROFILES TABLE
-- Stores user information (linked to Supabase auth.users)
-- ==============================================================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  user_type user_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ==============================================================================
-- PROPERTIES TABLE
-- Stores rental property information
-- ==============================================================================
CREATE TABLE properties (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  property_address TEXT NOT NULL,
  renter_name TEXT NOT NULL,
  renter_email TEXT NOT NULL,
  move_in_date DATE NOT NULL,
  status property_status DEFAULT 'pending',
  tenancy_agreement_url TEXT,
  owner_email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Policies for properties
CREATE POLICY "Users can view their own properties"
  ON properties FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own properties"
  ON properties FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own properties"
  ON properties FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own properties"
  ON properties FOR DELETE
  USING (auth.uid() = user_id);

-- ==============================================================================
-- MOVE_IN_REPORTS TABLE
-- Stores property condition reports with photos and AI analysis
-- ==============================================================================
CREATE TABLE move_in_reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rooms JSONB NOT NULL, -- Stores array of room data with photos and AI analysis
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE move_in_reports ENABLE ROW LEVEL SECURITY;

-- Policies for move_in_reports
CREATE POLICY "Users can view their own reports"
  ON move_in_reports FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reports"
  ON move_in_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reports"
  ON move_in_reports FOR UPDATE
  USING (auth.uid() = user_id);

-- ==============================================================================
-- UTILITY_READINGS TABLE
-- Stores monthly utility payments (water, electricity, rent)
-- ==============================================================================
CREATE TABLE utility_readings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  water DECIMAL(10, 2) DEFAULT 0,
  electricity DECIMAL(10, 2) DEFAULT 0,
  rent DECIMAL(10, 2) DEFAULT 0,
  water_receipt_url TEXT,
  electricity_receipt_url TEXT,
  rent_receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE utility_readings ENABLE ROW LEVEL SECURITY;

-- Policies for utility_readings
CREATE POLICY "Users can view their own utility readings"
  ON utility_readings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own utility readings"
  ON utility_readings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own utility readings"
  ON utility_readings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own utility readings"
  ON utility_readings FOR DELETE
  USING (auth.uid() = user_id);

-- ==============================================================================
-- STORAGE BUCKETS
-- For storing photos, receipts, and documents
-- ==============================================================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('property-photos', 'property-photos', true),
  ('receipts', 'receipts', true),
  ('agreements', 'agreements', true);

-- Storage policies for property-photos
CREATE POLICY "Users can upload property photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'property-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view property photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'property-photos');

-- Storage policies for receipts
CREATE POLICY "Users can upload their receipts"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their receipts"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for agreements
CREATE POLICY "Users can upload agreements"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'agreements' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their agreements"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'agreements' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ==============================================================================
-- FUNCTIONS AND TRIGGERS
-- ==============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, user_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    COALESCE((NEW.raw_user_meta_data->>'user_type')::user_type, 'tenant')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================

CREATE INDEX idx_properties_user_id ON properties(user_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_move_in_reports_property_id ON move_in_reports(property_id);
CREATE INDEX idx_move_in_reports_user_id ON move_in_reports(user_id);
CREATE INDEX idx_utility_readings_property_id ON utility_readings(property_id);
CREATE INDEX idx_utility_readings_user_id ON utility_readings(user_id);
CREATE INDEX idx_utility_readings_date ON utility_readings(date);

-- ==============================================================================
-- GRANT PERMISSIONS
-- ==============================================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- ==============================================================================
-- SUCCESS MESSAGE
-- ==============================================================================

-- Verify tables created
SELECT 'Database schema created successfully!' AS message;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'properties', 'move_in_reports', 'utility_readings');

