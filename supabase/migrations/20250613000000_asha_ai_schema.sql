-- ASHA AI — Supabase schema (fresh project bootstrap)

create extension if not exists "uuid-ossp";

create type user_role as enum ('beneficiary', 'asha_worker', 'partner', 'admin');
create type user_type as enum ('girl', 'pregnant', 'mother');
create type anemia_status as enum ('normal', 'mild', 'moderate', 'severe');
create type risk_level as enum ('low', 'medium', 'high');
create type economic_status as enum ('bpl', 'apl');
create type alert_severity as enum ('medium', 'high', 'critical');
create type alert_status as enum ('open', 'resolved');
create type alert_type as enum ('sos', 'health_risk');
create type scheme_provider as enum ('Govt', 'NGO');
create type scheme_category as enum ('financial', 'nutrition', 'health');
create type scheme_status as enum ('active', 'draft', 'closed');
create type enrollment_status as enum ('pending', 'approved', 'rejected');
create type mood_type as enum ('Happy', 'Neutral', 'Sad', 'Tired', 'Anxious', 'Pain');

create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  full_name text,
  role user_role default 'beneficiary',
  avatar_url text,
  phone_number text,
  language text default 'hi',
  created_at timestamptz default timezone('utc', now())
);

alter table public.users enable row level security;

create policy "Users can read own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

create table public.beneficiary_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  name text not null,
  user_type user_type default 'pregnant',
  age int,
  height numeric,
  weight numeric,
  blood_group text,
  last_period_date date,
  pregnancy_stage text,
  pregnancy_week int,
  edd date,
  anemia_status anemia_status default 'normal',
  risk_level risk_level default 'low',
  economic_status economic_status,
  linked_asha_id uuid references public.users(id),
  next_checkup_date date,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

alter table public.beneficiary_profiles enable row level security;

create table public.digital_health_cards (
  id uuid primary key default uuid_generate_v4(),
  beneficiary_id uuid references public.beneficiary_profiles(id) on delete cascade,
  card_uid text unique not null,
  qr_payload jsonb,
  is_active boolean default true,
  issued_at timestamptz default timezone('utc', now())
);

create table public.daily_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  date date not null,
  mood mood_type,
  symptoms text[],
  notes text,
  flow text,
  created_at timestamptz default timezone('utc', now())
);

create table public.health_logs (
  id uuid primary key default uuid_generate_v4(),
  beneficiary_id uuid references public.beneficiary_profiles(id) on delete cascade,
  recorded_by uuid references public.users(id),
  date timestamptz default timezone('utc', now()),
  bp_systolic int,
  bp_diastolic int,
  symptoms text[],
  mood text,
  voice_note_url text,
  ai_summary text,
  is_emergency boolean default false,
  visit_type text default 'home',
  created_at timestamptz default timezone('utc', now())
);

create table public.alerts (
  id uuid primary key default uuid_generate_v4(),
  beneficiary_id uuid references public.beneficiary_profiles(id) on delete cascade,
  type alert_type not null,
  severity alert_severity not null,
  status alert_status default 'open',
  timestamp timestamptz default timezone('utc', now()),
  triggered_by uuid references public.users(id),
  resolved_by uuid references public.users(id),
  resolution_notes text
);

create table public.schemes (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  provider scheme_provider not null,
  category scheme_category not null,
  description text,
  hero_image text,
  benefits text[],
  eligibility_criteria text[],
  target_audience jsonb,
  status scheme_status default 'active',
  budget numeric default 0,
  start_date date,
  end_date date,
  created_by uuid references public.users(id),
  created_at timestamptz default timezone('utc', now())
);

create table public.enrollments (
  id uuid primary key default uuid_generate_v4(),
  scheme_id uuid references public.schemes(id) on delete cascade,
  beneficiary_id uuid references public.beneficiary_profiles(id) on delete cascade,
  status enrollment_status default 'pending',
  enrolled_by uuid references public.users(id),
  enrollment_date timestamptz default timezone('utc', now())
);

create table public.content_topics (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  subtitle text,
  category text,
  content_type text default 'text',
  content_data jsonb,
  icon_key text,
  color_theme text,
  language text default 'en'
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'beneficiary')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
