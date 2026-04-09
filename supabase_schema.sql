-- Run this entire file in the Supabase SQL Editor (Dashboard → SQL Editor → New query)

-- ─── lesson_attempts ────────────────────────────────────────────────────────
create table if not exists lesson_attempts (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  user_name       text not null,
  lesson_id       text not null,
  completed_at    timestamptz not null default now(),
  correct_count   int  not null,
  total_questions int  not null,
  xp_earned       int  not null
);

alter table lesson_attempts enable row level security;

-- Students insert their own rows
create policy "insert own attempts"
  on lesson_attempts for insert
  with check (auth.uid() = user_id);

-- Students read their own rows; teachers read all
create policy "read attempts"
  on lesson_attempts for select
  using (
    auth.uid() = user_id
    or (
      select raw_user_meta_data->>'role'
      from auth.users
      where id = auth.uid()
    ) = 'teacher'
  );

-- ─── lesson_answers ──────────────────────────────────────────────────────────
create table if not exists lesson_answers (
  id              uuid primary key default gen_random_uuid(),
  attempt_id      uuid not null references lesson_attempts(id) on delete cascade,
  user_id         uuid not null references auth.users(id) on delete cascade,
  lesson_id       text not null,
  step_index      int  not null,
  question        text not null,
  selected_option text not null,
  correct_option  text not null,
  is_correct      boolean not null
);

alter table lesson_answers enable row level security;

-- Students insert their own rows
create policy "insert own answers"
  on lesson_answers for insert
  with check (auth.uid() = user_id);

-- Students read their own rows; teachers read all
create policy "read answers"
  on lesson_answers for select
  using (
    auth.uid() = user_id
    or (
      select raw_user_meta_data->>'role'
      from auth.users
      where id = auth.uid()
    ) = 'teacher'
  );
