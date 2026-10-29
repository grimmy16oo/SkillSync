-- Allow authenticated members to add shared skills to the catalogue.
-- Skill names are limited here as well as in the UI; users cannot write other tables through this policy.
alter table public.skills enable row level security;
grant insert on table public.skills to authenticated;

drop policy if exists "Authenticated users can add skills to the catalogue" on public.skills;
create policy "Authenticated users can add skills to the catalogue"
  on public.skills
  for insert
  to authenticated
  with check (
    char_length(btrim(skill_name)) between 2 and 60
    and skill_name = btrim(skill_name)
  );
