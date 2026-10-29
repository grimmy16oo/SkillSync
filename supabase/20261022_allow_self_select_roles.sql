-- Let a signed-in member add their own learner and/or instructor role.
-- This role is a participation choice; users cannot assign roles to other accounts.
alter table public.user_roles enable row level security;
grant insert, delete on table public.user_roles to authenticated;

drop policy if exists "Users can add their own learner or instructor roles" on public.user_roles;
create policy "Users can add their own learner or instructor roles"
  on public.user_roles
  for insert
  to authenticated
  with check (
    user_id = (select auth.uid())
    and role in ('learner', 'instructor')
  );

drop policy if exists "Users can remove their own learner or instructor roles" on public.user_roles;
create policy "Users can remove their own learner or instructor roles"
  on public.user_roles
  for delete
  to authenticated
  using (
    user_id = (select auth.uid())
    and role in ('learner', 'instructor')
  );
