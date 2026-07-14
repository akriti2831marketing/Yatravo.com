ALTER TABLE public.trips
  ADD COLUMN IF NOT EXISTS state text,
  ADD COLUMN IF NOT EXISTS destination_type text,
  ADD COLUMN IF NOT EXISTS best_photo_url text,
  ADD COLUMN IF NOT EXISTS mood_tags text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS logged_via text NOT NULL DEFAULT 'manual';