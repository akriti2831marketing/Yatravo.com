
-- Raahi profiles
CREATE TABLE public.raahi_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  handle text NOT NULL UNIQUE,
  raahi_name text NOT NULL,
  bio text,
  content_styles text[],
  years_travelling text,
  instagram_url text,
  youtube_url text,
  website_url text,
  other_url text,
  cover_photo_url text,
  commitment_agreed boolean NOT NULL DEFAULT false,
  commitment_agreed_at timestamptz,
  verified_raahi boolean NOT NULL DEFAULT false,
  verified_at timestamptz,
  show_upcoming_trips boolean NOT NULL DEFAULT true,
  allow_join_requests boolean NOT NULL DEFAULT true,
  profile_views integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT raahi_handle_format CHECK (handle ~ '^[a-z0-9_-]{2,30}$')
);
GRANT SELECT ON public.raahi_profiles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.raahi_profiles TO authenticated;
GRANT ALL ON public.raahi_profiles TO service_role;
ALTER TABLE public.raahi_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Raahi profiles are public readable" ON public.raahi_profiles FOR SELECT USING (true);
CREATE POLICY "Owners insert own raahi profile" ON public.raahi_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners update own raahi profile" ON public.raahi_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners delete own raahi profile" ON public.raahi_profiles FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Followers
CREATE TABLE public.raahi_followers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  raahi_id uuid NOT NULL REFERENCES public.raahi_profiles(id) ON DELETE CASCADE,
  follower_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  followed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (raahi_id, follower_user_id)
);
GRANT SELECT ON public.raahi_followers TO anon;
GRANT SELECT, INSERT, DELETE ON public.raahi_followers TO authenticated;
GRANT ALL ON public.raahi_followers TO service_role;
ALTER TABLE public.raahi_followers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Follower rows are public readable" ON public.raahi_followers FOR SELECT USING (true);
CREATE POLICY "Users follow as themselves" ON public.raahi_followers FOR INSERT TO authenticated WITH CHECK (auth.uid() = follower_user_id);
CREATE POLICY "Users unfollow their own rows" ON public.raahi_followers FOR DELETE TO authenticated USING (auth.uid() = follower_user_id);

-- Creator trails
CREATE TABLE public.creator_trails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  raahi_id uuid NOT NULL REFERENCES public.raahi_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  difficulty text CHECK (difficulty IN ('easy','moderate','challenging','expert')),
  best_seasons text[],
  duration_days integer,
  is_public boolean NOT NULL DEFAULT false,
  save_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.creator_trails TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.creator_trails TO authenticated;
GRANT ALL ON public.creator_trails TO service_role;
ALTER TABLE public.creator_trails ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public trails readable" ON public.creator_trails FOR SELECT USING (
  is_public = true OR EXISTS (SELECT 1 FROM public.raahi_profiles p WHERE p.id = raahi_id AND p.user_id = auth.uid())
);
CREATE POLICY "Raahi owns trail insert" ON public.creator_trails FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.raahi_profiles p WHERE p.id = raahi_id AND p.user_id = auth.uid())
);
CREATE POLICY "Raahi owns trail update" ON public.creator_trails FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.raahi_profiles p WHERE p.id = raahi_id AND p.user_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.raahi_profiles p WHERE p.id = raahi_id AND p.user_id = auth.uid())
);
CREATE POLICY "Raahi owns trail delete" ON public.creator_trails FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.raahi_profiles p WHERE p.id = raahi_id AND p.user_id = auth.uid())
);

-- Trail stops
CREATE TABLE public.trail_stops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trail_id uuid NOT NULL REFERENCES public.creator_trails(id) ON DELETE CASCADE,
  stop_order integer NOT NULL,
  destination text NOT NULL,
  state text,
  days_recommended integer,
  raahi_note text,
  photo_url text,
  trip_id uuid REFERENCES public.trips(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.trail_stops TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trail_stops TO authenticated;
GRANT ALL ON public.trail_stops TO service_role;
ALTER TABLE public.trail_stops ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public trail stops readable" ON public.trail_stops FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.creator_trails t JOIN public.raahi_profiles p ON p.id = t.raahi_id
          WHERE t.id = trail_id AND (t.is_public = true OR p.user_id = auth.uid()))
);
CREATE POLICY "Trail owner manages stops" ON public.trail_stops FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.creator_trails t JOIN public.raahi_profiles p ON p.id = t.raahi_id
          WHERE t.id = trail_id AND p.user_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.creator_trails t JOIN public.raahi_profiles p ON p.id = t.raahi_id
          WHERE t.id = trail_id AND p.user_id = auth.uid())
);

-- Trail saves
CREATE TABLE public.trail_saves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trail_id uuid NOT NULL REFERENCES public.creator_trails(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  saved_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (trail_id, user_id)
);
GRANT SELECT ON public.trail_saves TO anon;
GRANT SELECT, INSERT, DELETE ON public.trail_saves TO authenticated;
GRANT ALL ON public.trail_saves TO service_role;
ALTER TABLE public.trail_saves ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Trail saves readable" ON public.trail_saves FOR SELECT USING (true);
CREATE POLICY "Users save as themselves" ON public.trail_saves FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own saves" ON public.trail_saves FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Raahi trip join requests (namespace-scoped table, separate from earlier creator_profile-based one)
CREATE TABLE public.raahi_trip_join_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  raahi_id uuid NOT NULL REFERENCES public.raahi_profiles(id) ON DELETE CASCADE,
  requester_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','declined')),
  requested_at timestamptz NOT NULL DEFAULT now(),
  responded_at timestamptz
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.raahi_trip_join_requests TO authenticated;
GRANT ALL ON public.raahi_trip_join_requests TO service_role;
ALTER TABLE public.raahi_trip_join_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Raahi or requester read" ON public.raahi_trip_join_requests FOR SELECT TO authenticated USING (
  auth.uid() = requester_user_id
  OR EXISTS (SELECT 1 FROM public.raahi_profiles p WHERE p.id = raahi_id AND p.user_id = auth.uid())
);
CREATE POLICY "Requester creates own request" ON public.raahi_trip_join_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = requester_user_id);
CREATE POLICY "Raahi responds to requests" ON public.raahi_trip_join_requests FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.raahi_profiles p WHERE p.id = raahi_id AND p.user_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.raahi_profiles p WHERE p.id = raahi_id AND p.user_id = auth.uid())
);

-- Vendor raahi endorsements
CREATE TABLE public.vendor_raahi_endorsements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid NOT NULL,
  raahi_id uuid NOT NULL REFERENCES public.raahi_profiles(id) ON DELETE CASCADE,
  trip_id uuid REFERENCES public.trips(id) ON DELETE SET NULL,
  stay_month text,
  stay_year integer,
  raahi_confirmed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.vendor_raahi_endorsements TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vendor_raahi_endorsements TO authenticated;
GRANT ALL ON public.vendor_raahi_endorsements TO service_role;
ALTER TABLE public.vendor_raahi_endorsements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Confirmed endorsements public" ON public.vendor_raahi_endorsements FOR SELECT USING (
  raahi_confirmed = true
  OR auth.uid() = vendor_id
  OR EXISTS (SELECT 1 FROM public.raahi_profiles p WHERE p.id = raahi_id AND p.user_id = auth.uid())
);
CREATE POLICY "Vendor creates endorsement" ON public.vendor_raahi_endorsements FOR INSERT TO authenticated WITH CHECK (auth.uid() = vendor_id);
CREATE POLICY "Raahi confirms endorsement" ON public.vendor_raahi_endorsements FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.raahi_profiles p WHERE p.id = raahi_id AND p.user_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.raahi_profiles p WHERE p.id = raahi_id AND p.user_id = auth.uid())
);

-- Profile view analytics
CREATE TABLE public.raahi_profile_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  raahi_id uuid NOT NULL REFERENCES public.raahi_profiles(id) ON DELETE CASCADE,
  viewer_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  viewed_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.raahi_profile_views TO anon, authenticated;
GRANT SELECT ON public.raahi_profile_views TO authenticated;
GRANT ALL ON public.raahi_profile_views TO service_role;
ALTER TABLE public.raahi_profile_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Raahi reads own views" ON public.raahi_profile_views FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.raahi_profiles p WHERE p.id = raahi_id AND p.user_id = auth.uid())
);
CREATE POLICY "Anyone logs a view" ON public.raahi_profile_views FOR INSERT WITH CHECK (
  (auth.uid() IS NULL AND viewer_user_id IS NULL)
  OR auth.uid() = viewer_user_id
);

-- Updated_at triggers
CREATE OR REPLACE FUNCTION public.touch_raahi_profiles_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER trg_touch_raahi_profiles BEFORE UPDATE ON public.raahi_profiles FOR EACH ROW EXECUTE FUNCTION public.touch_raahi_profiles_updated_at();

CREATE OR REPLACE FUNCTION public.touch_creator_trails_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER trg_touch_creator_trails BEFORE UPDATE ON public.creator_trails FOR EACH ROW EXECUTE FUNCTION public.touch_creator_trails_updated_at();
