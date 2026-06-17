
CREATE POLICY "Anyone authenticated can view trip photos" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'trip-photos');
CREATE POLICY "Users upload own trip photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'trip-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users update own trip photos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'trip-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users delete own trip photos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'trip-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
