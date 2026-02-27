-- ClipEngine Database Schema
-- Run this in your Supabase SQL editor

-- User profiles
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  plan text default 'free' check (plan in ('free', 'pro')),
  clips_this_month integer default 0,
  stripe_customer_id text,
  brand_voice text,
  default_platforms text[] default '{"tiktok","instagram","youtube_shorts"}',
  created_at timestamptz default now()
);

-- Source content (long-form videos/podcasts)
create table public.sources (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade,
  title text,
  source_url text,
  source_type text check (source_type in ('youtube', 'podcast', 'upload', 'twitch')),
  duration_seconds integer,
  transcript text,
  transcript_segments jsonb,
  status text default 'pending' check (status in ('pending', 'transcribing', 'analyzing', 'ready', 'error')),
  thumbnail_url text,
  created_at timestamptz default now()
);

-- Generated clips
create table public.clips (
  id uuid default gen_random_uuid() primary key,
  source_id uuid references public.sources on delete cascade,
  user_id uuid references public.profiles on delete cascade,
  title text,
  hook text,
  start_time numeric(10,2),
  end_time numeric(10,2),
  duration_seconds numeric(10,2),
  viral_score integer check (viral_score between 1 and 100),
  why_viral text,
  caption_tiktok text,
  caption_instagram text,
  caption_youtube text,
  hashtags text[],
  status text default 'suggested' check (status in ('suggested', 'approved', 'exported', 'posted')),
  video_url text,
  thumbnail_url text,
  created_at timestamptz default now()
);

-- RLS
alter table public.profiles enable row level security;
alter table public.sources enable row level security;
alter table public.clips enable row level security;

create policy "Users manage own profile" on public.profiles
  for all using (auth.uid() = id);

create policy "Users manage own sources" on public.sources
  for all using (auth.uid() = user_id);

create policy "Users manage own clips" on public.clips
  for all using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Monthly clips reset (run via Supabase cron or external scheduler)
-- update public.profiles set clips_this_month = 0;
