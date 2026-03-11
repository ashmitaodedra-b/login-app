-- ============================================================
-- GoFinance — Seed / Demo Data
-- Run with: psql $DATABASE_URL -f supabase/seed.sql
-- Or via the seed script: npm run db:seed
-- ============================================================

-- Demo users are created via Supabase Auth API in the seed script.
-- This file seeds the remaining tables using those user IDs.
-- User IDs are resolved by email lookup after auth users are created.

do $$
declare
  u1 uuid; -- alice@gofinance.dev
  u2 uuid; -- bob@gofinance.dev
  u3 uuid; -- carol@gofinance.dev
  u4 uuid; -- dan@gofinance.dev

  loan1 uuid;
  loan2 uuid;
  loan3 uuid;
  loan4 uuid;
  loan5 uuid;
begin

  -- Resolve user IDs from auth.users
  select id into u1 from auth.users where email = 'alice@gofinance.dev';
  select id into u2 from auth.users where email = 'bob@gofinance.dev';
  select id into u3 from auth.users where email = 'carol@gofinance.dev';
  select id into u4 from auth.users where email = 'dan@gofinance.dev';

  if u1 is null or u2 is null or u3 is null or u4 is null then
    raise exception 'Seed users not found in auth.users. Run the seed script (npm run db:seed) to create them first.';
  end if;

  -- ── user_profiles ─────────────────────────────────────────
  insert into public.user_profiles (id, full_name, phone, balance, total_invested, total_borrowed, credit_score)
  values
    (u1, 'Alice Tan',   '+65 9123 4567', 12500.00, 45000.00,  0.00,     820),
    (u2, 'Bob Lim',     '+65 9234 5678',  3800.00,  8500.00, 15000.00,  710),
    (u3, 'Carol Wong',  '+65 9345 6789',  9200.00, 21000.00,  5000.00,  760),
    (u4, 'Dan Ng',      '+65 9456 7890',  1500.00,     0.00, 22000.00,  640)
  on conflict (id) do update set
    full_name      = excluded.full_name,
    phone          = excluded.phone,
    balance        = excluded.balance,
    total_invested = excluded.total_invested,
    total_borrowed = excluded.total_borrowed,
    credit_score   = excluded.credit_score;

  -- ── loans ─────────────────────────────────────────────────
  loan1 := gen_random_uuid();
  loan2 := gen_random_uuid();
  loan3 := gen_random_uuid();
  loan4 := gen_random_uuid();
  loan5 := gen_random_uuid();

  insert into public.loans
    (id, borrower_id, title, purpose, amount, funded_amount, interest_rate, duration_months, status, description, risk_grade, funded_at, due_date)
  values
    (
      loan1, u2,
      'Expand my café — second location',
      'business', 15000.00, 15000.00, 8.5, 24, 'active',
      'Opening a second outlet in Tiong Bahru. Existing location has been profitable for 3 years.',
      'B',
      now() - interval '2 months',
      now() + interval '22 months'
    ),
    (
      loan2, u4,
      'MBA programme at NUS',
      'education', 22000.00, 14300.00, 6.0, 36, 'open',
      'Funding my part-time MBA. Currently employed as a senior analyst with stable income.',
      'A',
      null, null
    ),
    (
      loan3, u4,
      'Car loan — Toyota Corolla',
      'vehicle', 18000.00, 18000.00, 9.0, 60, 'repaid',
      'Used car purchase. Fully repaid ahead of schedule.',
      'C',
      now() - interval '18 months',
      now() - interval '1 month'
    ),
    (
      loan4, u2,
      'Home renovation — HDB resale flat',
      'home', 12000.00, 4800.00, 7.5, 18, 'open',
      'Renovation for newly purchased 4-room HDB. Quotes attached.',
      'B',
      null, null
    ),
    (
      loan5, u4,
      'Medical bill consolidation',
      'medical', 8000.00, 8000.00, 11.0, 12, 'active',
      'Consolidating outstanding hospital bills from unexpected surgery.',
      'D',
      now() - interval '1 month',
      now() + interval '11 months'
    );

  -- ── loan_investments ──────────────────────────────────────
  insert into public.loan_investments (loan_id, investor_id, amount, returns)
  values
    -- Alice invested in loan1 (Bob's café)
    (loan1, u1, 8000.00, 340.00),
    -- Carol invested in loan1
    (loan1, u3, 7000.00, 297.50),
    -- Alice invested in loan2 (Dan's MBA)
    (loan2, u1, 10000.00, 0.00),
    -- Carol invested in loan2
    (loan2, u3, 4300.00, 0.00),
    -- Alice invested in loan4 (Bob's reno)
    (loan4, u1, 4800.00, 0.00),
    -- Carol invested in loan5 (Dan's medical)
    (loan3, u3, 9700.00, 1455.00),
    -- Alice invested in loan5
    (loan5, u1, 5000.00, 91.67),
    -- Carol invested in loan5
    (loan5, u3, 3000.00, 55.00)
  on conflict (loan_id, investor_id) do nothing;

  -- ── transactions ─────────────────────────────────────────
  insert into public.transactions (user_id, type, amount, description, ref_id)
  values
    -- Alice
    (u1, 'deposit',    50000.00, 'Initial deposit',                      null),
    (u1, 'investment',  8000.00, 'Invested in: Expand my café',          loan1),
    (u1, 'investment', 10000.00, 'Invested in: MBA programme at NUS',    loan2),
    (u1, 'investment',  4800.00, 'Invested in: Home renovation',         loan4),
    (u1, 'investment',  5000.00, 'Invested in: Medical bill consolidation', loan5),
    (u1, 'interest',     340.00, 'Interest received: café loan',         loan1),
    (u1, 'interest',      91.67, 'Interest received: medical loan',      loan5),
    -- Bob
    (u2, 'deposit',     5000.00, 'Initial deposit',                      null),
    (u2, 'investment',  8500.00, 'Invested in various loans',            null),
    -- Carol
    (u3, 'deposit',    35000.00, 'Initial deposit',                      null),
    (u3, 'investment',  7000.00, 'Invested in: Expand my café',          loan1),
    (u3, 'investment',  4300.00, 'Invested in: MBA programme at NUS',    loan2),
    (u3, 'investment',  9700.00, 'Invested in: Car loan',                loan3),
    (u3, 'investment',  3000.00, 'Invested in: Medical bill',            loan5),
    (u3, 'interest',    297.50, 'Interest received: café loan',          loan1),
    (u3, 'interest',   1455.00, 'Interest received: car loan',           loan3),
    (u3, 'interest',     55.00, 'Interest received: medical loan',       loan5),
    -- Dan
    (u4, 'deposit',     2000.00, 'Initial deposit',                      null),
    (u4, 'repayment',  18000.00, 'Loan repaid: Car loan',                loan3),
    (u4, 'repayment',    800.00, 'Monthly repayment: Medical',           loan5);

end $$;
