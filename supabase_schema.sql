-- Run this entire file in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- NOTE: If re-running, the "create table if not exists" clauses are safe to re-run.
-- The uploaded_lessons table at the bottom is new — run it once to enable lesson uploads.

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

-- ─── uploaded_lessons ────────────────────────────────────────────────────────
create table if not exists uploaded_lessons (
  id          uuid primary key default gen_random_uuid(),
  created_by  uuid not null references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  lesson_data jsonb not null
);

alter table uploaded_lessons enable row level security;

-- Only teachers can insert lessons
create policy "teachers insert lessons"
  on uploaded_lessons for insert
  with check (
    (
      select raw_user_meta_data->>'role'
      from auth.users
      where id = auth.uid()
    ) = 'teacher'
  );

-- All authenticated users can read lessons
create policy "all read lessons"
  on uploaded_lessons for select
  using (auth.uid() is not null);

-- Teachers can delete their own uploaded lessons
create policy "teachers delete own lessons"
  on uploaded_lessons for delete
  using (
    auth.uid() = created_by
    and (
      select raw_user_meta_data->>'role'
      from auth.users
      where id = auth.uid()
    ) = 'teacher'
  );
