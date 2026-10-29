-- The post-attachments bucket must enforce the same limits as the client.
-- Apply this once in the Supabase SQL Editor as a project administrator.
DO $$
DECLARE
  updated_count integer;
BEGIN
  UPDATE storage.buckets
  SET public = false,
      file_size_limit = 10485760,
      allowed_mime_types = ARRAY[
        'image/jpeg',
        'image/png',
        'image/webp',
        'application/pdf',
        'video/mp4'
      ]
  WHERE id = 'post-attachments';

  GET DIAGNOSTICS updated_count = ROW_COUNT;
  IF updated_count = 0 THEN
    RAISE EXCEPTION 'Expected existing Storage bucket post-attachments; no bucket was updated.';
  END IF;
END $$;
