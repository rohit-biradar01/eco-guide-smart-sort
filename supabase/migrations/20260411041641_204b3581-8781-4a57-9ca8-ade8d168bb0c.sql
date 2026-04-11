
-- 1. Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- 2. Bulky pickups table
CREATE TABLE public.bulky_pickups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  category TEXT NOT NULL,
  item_description TEXT,
  pickup_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.bulky_pickups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own pickups" ON public.bulky_pickups FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own pickups" ON public.bulky_pickups FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. Dumping reports table
CREATE TABLE public.dumping_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  photo_url TEXT,
  status TEXT NOT NULL DEFAULT 'Received',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.dumping_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own reports" ON public.dumping_reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own reports" ON public.dumping_reports FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. Waste tracker entries
CREATE TABLE public.waste_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_label TEXT NOT NULL,
  generated_kg DOUBLE PRECISION NOT NULL DEFAULT 0,
  recycled_kg DOUBLE PRECISION NOT NULL DEFAULT 0,
  week_start DATE NOT NULL DEFAULT (date_trunc('week', now()))::date,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, day_label, week_start)
);
ALTER TABLE public.waste_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own entries" ON public.waste_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own entries" ON public.waste_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own entries" ON public.waste_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own entries" ON public.waste_entries FOR DELETE USING (auth.uid() = user_id);

-- 5. Classifications history
CREATE TABLE public.classifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  query_text TEXT,
  category TEXT NOT NULL,
  bin_color TEXT,
  instructions TEXT,
  classification_type TEXT NOT NULL DEFAULT 'text',
  confidence DOUBLE PRECISION,
  segmented_image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.classifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own classifications" ON public.classifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own classifications" ON public.classifications FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6. Scrap estimations
CREATE TABLE public.scrap_estimations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  result_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.scrap_estimations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own estimations" ON public.scrap_estimations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own estimations" ON public.scrap_estimations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 7. Calendar events
CREATE TABLE public.calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_date DATE NOT NULL,
  event_type TEXT NOT NULL,
  label TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own events" ON public.calendar_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own events" ON public.calendar_events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own events" ON public.calendar_events FOR DELETE USING (auth.uid() = user_id);

-- Shared updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_dumping_reports_updated_at BEFORE UPDATE ON public.dumping_reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_waste_entries_updated_at BEFORE UPDATE ON public.waste_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.email, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
