-- Store member birth dates in the private profile row rather than keeping them
-- in Supabase Auth user metadata after signup synchronization.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS date_of_birth date;
