-- ============================================================
-- GoFinance — Initial Schema
-- ============================================================

-- ── Extensions ───────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── user_profiles ────────────────────────────────────────────
create table public.user_profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  full_name       text not null default '',
  avatar_url      text,
  phone           text,
  balance         numeric(14,2) not null default 0,
  total_invested  numeric(14,2) not null default 0,
  total_borrowed  numeric(14,2) not null default 0,
  credit_score    int not null default 700 check (credit_score between 300 and 850),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.user_profiles enable row level security;

create policy "Users can view their own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.user_profiles for update
  using (auth.uid() = id);

-- ── loans ────────────────────────────────────────────────────
create type public.loan_status as enum (
  'open', 'funded', 'active', 'repaid', 'defaulted'
);

create type public.loan_purpose as enum (
  'business', 'education', 'medical', 'home', 'vehicle', 'personal'
);

create table public.loans (
  id              uuid primary key default gen_random_uuid(),
  borrower_id     uuid not null references public.user_profiles(id) on delete cascade,
  title           text not null,
  purpose         public.loan_purpose not null,
  amount          numeric(14,2) not null check (amount > 0),
  funded_amount   numeric(14,2) not null default 0 check (funded_amount >= 0),
  interest_rate   numeric(5,2) not null check (interest_rate > 0),
  duration_months int not null check (duration_months > 0),
  status          public.loan_status not null default 'open',
  description     text,
  risk_grade      char(1) not null default 'B' check (risk_grade in ('A','B','C','D','E')),
  funded_at       timestamptz,
  due_date        timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.loans enable row level security;

create policy "Anyone can view open loans"
  on public.loans for select
  using (true);

create policy "Borrowers can insert their own loans"
  on public.loans for insert
  with check (auth.uid() = borrower_id);

create policy "Borrowers can update their own loans"
  on public.loans for update
  using (auth.uid() = borrower_id);

-- ── loan_investments ─────────────────────────────────────────
create table public.loan_investments (
  id          uuid primary key default gen_random_uuid(),
  loan_id     uuid not null references public.loans(id) on delete cascade,
  investor_id uuid not null references public.user_profiles(id) on delete cascade,
  amount      numeric(14,2) not null check (amount > 0),
  returns     numeric(14,2) not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (loan_id, investor_id)
);

alter table public.loan_investments enable row level security;

create policy "Investors can view their own investments"
  on public.loan_investments for select
  using (auth.uid() = investor_id);

create policy "Investors can insert investments"
  on public.loan_investments for insert
  with check (auth.uid() = investor_id);

-- ── transactions ─────────────────────────────────────────────
create type public.transaction_type as enum (
  'deposit', 'withdrawal', 'investment', 'repayment', 'interest'
);

create table public.transactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.user_profiles(id) on delete cascade,
  type        public.transaction_type not null,
  amount      numeric(14,2) not null,
  description text not null,
  ref_id      uuid,
  created_at  timestamptz not null default now()
);

alter table public.transactions enable row level security;

create policy "Users can view their own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own transactions"
  on public.transactions for insert
  with check (auth.uid() = user_id);

-- ── updated_at triggers ──────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_user_profiles_updated_at
  before update on public.user_profiles
  for each row execute function public.handle_updated_at();

create trigger trg_loans_updated_at
  before update on public.loans
  for each row execute function public.handle_updated_at();

create trigger trg_loan_investments_updated_at
  before update on public.loan_investments
  for each row execute function public.handle_updated_at();

-- ── auto-create profile on signup ────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.user_profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
