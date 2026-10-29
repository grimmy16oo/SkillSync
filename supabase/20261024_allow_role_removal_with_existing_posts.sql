-- Preserve historical posts when a member removes a role.
-- New posts must still use a role that is active for their author at creation time.
alter table public.posts
  drop constraint if exists posts_user_id_posting_role_fkey;

create or replace function public.enforce_active_posting_role()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if auth.uid() is not null and auth.uid() <> new.user_id then
    raise exception 'You can only create posts for your own account.'
      using errcode = '42501';
  end if;

  perform 1
  from public.user_roles as assigned_role
  where assigned_role.user_id = new.user_id
    and assigned_role.role = new.posting_role
  for key share;

  if not found then
    raise exception 'Your account must have the selected posting role.'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

revoke all on function public.enforce_active_posting_role() from public;

drop trigger if exists posts_require_active_posting_role on public.posts;
create trigger posts_require_active_posting_role
  before insert or update of user_id, posting_role
  on public.posts
  for each row
  execute function public.enforce_active_posting_role();
