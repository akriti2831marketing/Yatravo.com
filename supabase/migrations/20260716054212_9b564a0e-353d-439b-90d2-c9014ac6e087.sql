
-- profiles: restrict SELECT to authenticated
DROP POLICY IF EXISTS "Profiles are readable by anyone" ON public.profiles;
CREATE POLICY "Authenticated users can read profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);
REVOKE SELECT ON public.profiles FROM anon;

-- trips: restrict SELECT to owner
DROP POLICY IF EXISTS "Trips readable by anyone" ON public.trips;
CREATE POLICY "Users can read own trips"
  ON public.trips FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
REVOKE SELECT ON public.trips FROM anon;

-- trip_confirmations: restrict SELECT to trip owner or confirmer
DROP POLICY IF EXISTS "Confirmations readable by anyone" ON public.trip_confirmations;
CREATE POLICY "Users can read relevant confirmations"
  ON public.trip_confirmations FOR SELECT
  TO authenticated
  USING (
    auth.uid() = confirmed_by_user_id
    OR EXISTS (SELECT 1 FROM public.trips t WHERE t.id = trip_id AND t.user_id = auth.uid())
  );
REVOKE SELECT ON public.trip_confirmations FROM anon;

-- user_trust_scores: restrict SELECT to authenticated
DROP POLICY IF EXISTS "Trust scores readable by anyone" ON public.user_trust_scores;
CREATE POLICY "Authenticated users can read trust scores"
  ON public.user_trust_scores FOR SELECT
  TO authenticated
  USING (true);
REVOKE SELECT ON public.user_trust_scores FROM anon;

-- storage: restrict trip-photos SELECT to owner (folder = uid)
DROP POLICY IF EXISTS "Anyone authenticated can view trip photos" ON storage.objects;
CREATE POLICY "Users can view own trip photos"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'trip-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
