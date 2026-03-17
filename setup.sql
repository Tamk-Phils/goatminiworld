-- MiniGoat World: Database Schema Setup

-- 1. Profiles/Users table
-- This table extends the Supabase Auth data
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Goats Inventory
CREATE TABLE IF NOT EXISTS public.goats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  breed TEXT NOT NULL,
  price NUMERIC NOT NULL,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'pending', 'adopted')),
  description TEXT,
  image_url TEXT, -- Legacy support
  images TEXT[] DEFAULT '{}', -- Multi-image support
  stats JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Adoption Requests
CREATE TABLE IF NOT EXISTS public.adoption_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  goat_id UUID REFERENCES public.goats(id) ON DELETE SET NULL,
  phone TEXT,
  experience TEXT,
  environment TEXT,
  motivation TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Messages (Chat System)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adoption_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Fix for Infinite Recursion: Create a helper function
CREATE OR REPLACE FUNCTION public.is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role = 'admin'
    FROM public.users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Basic Policies (Public read for goats, authenticated for others)
DROP POLICY IF EXISTS "Public goats are viewable by everyone" ON public.goats;
CREATE POLICY "Public goats are viewable by everyone" ON public.goats FOR SELECT USING (true);

-- User Profile Policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id OR role = 'admin');

DROP POLICY IF EXISTS "Anyone can see admins" ON public.users;
CREATE POLICY "Anyone can see admins" ON public.users FOR SELECT USING (role = 'admin');

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
CREATE POLICY "Users can insert their own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Adoption Request Policies
DROP POLICY IF EXISTS "Users can view their own adoption requests" ON public.adoption_requests;
CREATE POLICY "Users can view their own adoption requests" ON public.adoption_requests FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own adoption requests" ON public.adoption_requests;
CREATE POLICY "Users can insert their own adoption requests" ON public.adoption_requests FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Message Policies
DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;
CREATE POLICY "Users can view their own messages" ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

DROP POLICY IF EXISTS "Users can insert their own messages" ON public.messages;
CREATE POLICY "Users can insert their own messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Notification Policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);

-- Admin Policies (Full access for admins using the helper function)
DROP POLICY IF EXISTS "Admins have full access to goats" ON public.goats;
CREATE POLICY "Admins have full access to goats" ON public.goats FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admins have full access to users" ON public.users;
CREATE POLICY "Admins have full access to users" ON public.users FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admins have full access to requests" ON public.adoption_requests;
CREATE POLICY "Admins have full access to requests" ON public.adoption_requests FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admins have full access to messages" ON public.messages;
CREATE POLICY "Admins have full access to messages" ON public.messages FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admins have full access to notifications" ON public.notifications;
CREATE POLICY "Admins have full access to notifications" ON public.notifications FOR ALL USING (public.is_admin());

-- Realtime Setup
-- Note: If you get an error saying these are already members, you can skip these lines.
-- Supabase often handles publication membership automatically via the dashboard.
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.adoption_requests;

-- 6. Automatic Profile Creation Trigger
-- This function inserts a row into public.users whenever a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, full_name, email, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute the function on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
-- 7. Manual Admin Seeding (Bypass Signup)
-- If you are hit by rate limits (429), you can manually insert a user here.
-- First, create the user in the Supabase Auth Dashboard, then run this:
/*
INSERT INTO public.users (id, full_name, email, role)
VALUES (
  'PASTE_USER_ID_FROM_AUTH_TAB_HERE', 
  'Admin User', 
  'your@email.com', 
  'admin'
) ON CONFLICT (id) DO UPDATE SET role = 'admin';
*/

-- 8. Supabase Storage Policies (Goats Bucket)
-- Note: Create the 'goats' bucket in the Supabase Dashboard first!
-- Allow everyone to view images
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
CREATE POLICY "Public Read Access" ON storage.objects FOR SELECT USING (bucket_id = 'goats');

-- Allow admins full access to the goats bucket
DROP POLICY IF EXISTS "Admin Full Access" ON storage.objects;
CREATE POLICY "Admin Full Access" ON storage.objects FOR ALL USING (bucket_id = 'goats' AND public.is_admin());
