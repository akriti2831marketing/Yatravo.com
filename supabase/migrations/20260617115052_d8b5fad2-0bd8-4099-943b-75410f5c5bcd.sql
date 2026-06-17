
-- Profiles table
CREATE TABLE public.profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are readable by anyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Trips
CREATE TABLE public.trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  destination text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  travel_style text CHECK (travel_style IN ('solo','friends','family','couple')),
  budget_tier text CHECK (budget_tier IN ('budget','midrange','premium')),
  note text,
  photo_urls text[] DEFAULT '{}'::text[],
  gmail_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trips TO authenticated;
GRANT SELECT ON public.trips TO anon;
GRANT ALL ON public.trips TO service_role;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Trips readable by anyone" ON public.trips FOR SELECT USING (true);
CREATE POLICY "Users insert own trips" ON public.trips FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own trips" ON public.trips FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own trips" ON public.trips FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX trips_user_id_idx ON public.trips(user_id);

-- Trip confirmations
CREATE TABLE public.trip_confirmations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  confirmed_by_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  confirmation_type text CHECK (confirmation_type IN ('matched_traveler','vendor')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(trip_id, confirmed_by_user_id)
);
GRANT SELECT, INSERT, DELETE ON public.trip_confirmations TO authenticated;
GRANT SELECT ON public.trip_confirmations TO anon;
GRANT ALL ON public.trip_confirmations TO service_role;
ALTER TABLE public.trip_confirmations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Confirmations readable by anyone" ON public.trip_confirmations FOR SELECT USING (true);
CREATE POLICY "Users insert own confirmations" ON public.trip_confirmations FOR INSERT WITH CHECK (auth.uid() = confirmed_by_user_id);
CREATE POLICY "Users delete own confirmations" ON public.trip_confirmations FOR DELETE USING (auth.uid() = confirmed_by_user_id);

-- Trust scores
CREATE TABLE public.user_trust_scores (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  trust_score integer NOT NULL DEFAULT 0,
  last_calculated timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.user_trust_scores TO authenticated;
GRANT SELECT ON public.user_trust_scores TO anon;
GRANT ALL ON public.user_trust_scores TO service_role;
ALTER TABLE public.user_trust_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Trust scores readable by anyone" ON public.user_trust_scores FOR SELECT USING (true);
CREATE POLICY "Users upsert own trust score" ON public.user_trust_scores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own trust score" ON public.user_trust_scores FOR UPDATE USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
