ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT '/default-image.png';