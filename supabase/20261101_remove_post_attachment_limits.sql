-- Remove the app-level attachment type and object-size restrictions.
-- Supabase project or plan limits may still apply to individual uploads.
DO $$
DECLARE
  updated_count integer;
BEGIN
  UPDATE storage.buckets
  SET file_size_limit = NULL,
      allowed_mime_types = NULL
  WHERE id = 'post-attachments';

  GET DIAGNOSTICS updated_count = ROW_COUNT;
  IF updated_count = 0 THEN
    RAISE EXCEPTION 'Expected existing Storage bucket post-attachments; no bucket was updated.';
  END IF;
END $$;
