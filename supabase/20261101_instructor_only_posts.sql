-- Restrict new skill offer posts to members with the instructor role.
CREATE OR REPLACE FUNCTION public.enforce_active_posting_role()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND auth.uid() <> NEW.user_id THEN
    RAISE EXCEPTION 'You can only create posts for your own account.'
      USING errcode = '42501';
  END IF;

  IF NEW.posting_role <> 'instructor' THEN
    RAISE EXCEPTION 'Only instructors can create skill offer posts.'
      USING errcode = '23514';
  END IF;

  PERFORM 1
  FROM public.user_roles AS assigned_role
  WHERE assigned_role.user_id = NEW.user_id
    AND assigned_role.role = 'instructor'
  FOR KEY SHARE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Your account must have the instructor role to create posts.'
      USING errcode = '23514';
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_active_posting_role() FROM PUBLIC;
