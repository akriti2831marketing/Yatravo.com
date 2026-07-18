
DROP POLICY IF EXISTS "Anyone logs a view" ON public.creator_profile_views;
CREATE POLICY "Anon logs anonymous view" ON public.creator_profile_views
  FOR INSERT TO anon WITH CHECK (viewer_user_id IS NULL);
CREATE POLICY "Auth logs own view" ON public.creator_profile_views
  FOR INSERT TO authenticated WITH CHECK (viewer_user_id = auth.uid() OR viewer_user_id IS NULL);
