
-- Creator profiles
CREATE TABLE public.creator_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL,
  handle text UNIQUE NOT NULL,
  creator_name text NOT NULL,
  bio text,
  primary_platform text,
  content_styles text[] DEFAULT '{}',
  years_travelling text,
  instagram_username text,
  instagram_followers integer,
  instagram_profile_pic text,
  instagram_connected_at timestamptz,
  youtube_username text,
  youtube_subscribers integer,
  website_url text,
  cover_photo_url text,
  commitment_agreed boolean NOT NULL DEFAULT false,
  commitment_agreed_at timestamptz,
  verified_creator boolean NOT NULL DEFAULT false,
  verified_at timestamptz,
  show_upcoming_trips boolean NOT NULL DEFAULT true,
  allow_join_requests boolean NOT NULL DEFAULT true,
  show_instagram_count boolean NOT NULL DEFAULT true,
  profile_views integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.creator_profiles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.creator_profiles TO authenticated;
GRANT ALL ON public.creator_profiles TO service_role;
ALTER TABLE public.creator_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read creator profiles" ON public.creator_profiles FOR SELECT USING (true);
CREATE POLICY "Users insert own creator profile" ON public.creator_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own creator profile" ON public.creator_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own creator profile" ON public.creator_profiles FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Followers
CREATE TABLE public.creator_followers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  follower_user_id uuid NOT NULL,
  followed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(creator_id, follower_user_id)
);
GRANT SELECT ON public.creator_followers TO anon;
GRANT SELECT, INSERT, DELETE ON public.creator_followers TO authenticated;
GRANT ALL ON public.creator_followers TO service_role;
ALTER TABLE public.creator_followers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read followers" ON public.creator_followers FOR SELECT USING (true);
CREATE POLICY "Users follow" ON public.creator_followers FOR INSERT TO authenticated WITH CHECK (auth.uid() = follower_user_id);
CREATE POLICY "Users unfollow" ON public.creator_followers FOR DELETE TO authenticated USING (auth.uid() = follower_user_id);

-- Trip join requests
CREATE TABLE public.trip_join_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  creator_id uuid NOT NULL REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  requester_user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','declined')),
  requested_at timestamptz NOT NULL DEFAULT now(),
  responded_at timestamptz
);
GRANT SELECT, INSERT, UPDATE ON public.trip_join_requests TO authenticated;
GRANT ALL ON public.trip_join_requests TO service_role;
ALTER TABLE public.trip_join_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Requester or creator reads" ON public.trip_join_requests FOR SELECT TO authenticated USING (
  auth.uid() = requester_user_id OR
  EXISTS (SELECT 1 FROM public.creator_profiles cp WHERE cp.id = trip_join_requests.creator_id AND cp.user_id = auth.uid())
);
CREATE POLICY "Users request" ON public.trip_join_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = requester_user_id);
CREATE POLICY "Creator responds" ON public.trip_join_requests FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.creator_profiles cp WHERE cp.id = trip_join_requests.creator_id AND cp.user_id = auth.uid())
);

-- Vendor endorsements
CREATE TABLE public.vendor_creator_endorsements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid NOT NULL,
  creator_id uuid NOT NULL REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  trip_id uuid REFERENCES public.trips(id) ON DELETE SET NULL,
  stay_month text,
  stay_year integer,
  creator_confirmed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.vendor_creator_endorsements TO anon;
GRANT SELECT, INSERT, UPDATE ON public.vendor_creator_endorsements TO authenticated;
GRANT ALL ON public.vendor_creator_endorsements TO service_role;
ALTER TABLE public.vendor_creator_endorsements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads endorsements" ON public.vendor_creator_endorsements FOR SELECT USING (true);
CREATE POLICY "Vendor inserts endorsement" ON public.vendor_creator_endorsements FOR INSERT TO authenticated WITH CHECK (auth.uid() = vendor_id);
CREATE POLICY "Creator confirms endorsement" ON public.vendor_creator_endorsements FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.creator_profiles cp WHERE cp.id = vendor_creator_endorsements.creator_id AND cp.user_id = auth.uid())
);

-- Profile view analytics
CREATE TABLE public.creator_profile_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  viewer_user_id uuid,
  viewed_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.creator_profile_views TO anon, authenticated;
GRANT SELECT ON public.creator_profile_views TO authenticated;
GRANT ALL ON public.creator_profile_views TO service_role;
ALTER TABLE public.creator_profile_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone logs a view" ON public.creator_profile_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Creator reads own views" ON public.creator_profile_views FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.creator_profiles cp WHERE cp.id = creator_profile_views.creator_id AND cp.user_id = auth.uid())
);

-- Extend trips
ALTER TABLE public.trips
  ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS trip_type text NOT NULL DEFAULT 'past' CHECK (trip_type IN ('past','upcoming'));

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_creator_profiles_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER trg_creator_profiles_updated_at BEFORE UPDATE ON public.creator_profiles
  FOR EACH ROW EXECUTE FUNCTION public.touch_creator_profiles_updated_at();
