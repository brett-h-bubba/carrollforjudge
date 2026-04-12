-- ─────────────────────────────────────────────────────────────────────
-- Migration 001 — Add `featured` flag to endorsements
-- Run this in Supabase SQL Editor after the initial schema.
-- ─────────────────────────────────────────────────────────────────────

alter table public.endorsements
  add column if not exists featured boolean not null default false,
  add column if not exists featured_at timestamptz;

create index if not exists endorsements_featured_idx
  on public.endorsements (featured, featured_at desc)
  where featured = true;

-- Enforce at most 3 featured endorsements (application-level enforcement
-- is the primary gate, this is a belt-and-suspenders safety net).
create or replace function public.enforce_featured_limit()
returns trigger as $$
declare
  featured_count int;
begin
  if new.featured = true and (old is null or old.featured = false) then
    select count(*) into featured_count
      from public.endorsements
      where featured = true
        and id <> new.id;
    if featured_count >= 3 then
      raise exception 'Cannot feature more than 3 endorsements. Unfeature one first.';
    end if;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists enforce_featured_limit_trigger on public.endorsements;
create trigger enforce_featured_limit_trigger
  before insert or update on public.endorsements
  for each row execute function public.enforce_featured_limit();
