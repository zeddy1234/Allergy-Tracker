-- Daily Log: Supabase schema
-- Run this once in your Supabase project's SQL Editor (Supabase dashboard -> SQL Editor -> New query)

-- Table: one row per day's entry
create table if not exists daily_entries (
  id uuid primary key default gen_random_uuid(),
  entry_date date not null unique,
  foods text[] default '{}',
  exercise text[] default '{}',
  sleep_hours numeric,
  medications text[] default '{}',
  symptoms jsonb default '[]', -- array of { name: string, severity: 'none' | 'mild' | 'severe' }
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Table: remembered items so she doesn't have to retype things.
-- "category" is one of: food, exercise, medication, symptom
create table if not exists saved_items (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('food', 'exercise', 'medication', 'symptom')),
  label text not null,
  use_count integer default 1,
  last_used_at timestamptz default now(),
  created_at timestamptz default now(),
  unique (category, label)
);

-- Enable Row Level Security
alter table daily_entries enable row level security;
alter table saved_items enable row level security;

-- This app has a single user (your sister) and uses the public anon key
-- with no login screen, so we allow open access to these two tables only.
-- Do not reuse this anon key/project for anything else sensitive.
create policy "Allow all access to daily_entries"
  on daily_entries for all
  using (true)
  with check (true);

create policy "Allow all access to saved_items"
  on saved_items for all
  using (true)
  with check (true);

-- Keep updated_at fresh on edits
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_daily_entries_updated_at on daily_entries;
create trigger trg_daily_entries_updated_at
  before update on daily_entries
  for each row
  execute function set_updated_at();
