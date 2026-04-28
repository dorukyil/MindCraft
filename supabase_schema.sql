-- Database schema for Supabase Backend --
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

drop policy if exists "insert own attempts" on lesson_attempts;
create policy "insert own attempts"
  on lesson_attempts for insert
  with check (auth.uid() = user_id);

drop policy if exists "read attempts" on lesson_attempts;
create policy "read attempts"
  on lesson_attempts for select
  using (
    auth.uid() = user_id
    or (select raw_user_meta_data->>'role' from auth.users where id = auth.uid()) = 'teacher'
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

drop policy if exists "insert own answers" on lesson_answers;
create policy "insert own answers"
  on lesson_answers for insert
  with check (auth.uid() = user_id);

drop policy if exists "read answers" on lesson_answers;
create policy "read answers"
  on lesson_answers for select
  using (
    auth.uid() = user_id
    or (select raw_user_meta_data->>'role' from auth.users where id = auth.uid()) = 'teacher'
  );

-- ─── uploaded_lessons ────────────────────────────────────────────────────────
create table if not exists uploaded_lessons (
  id          uuid primary key default gen_random_uuid(),
  created_by  uuid not null references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  lesson_data jsonb not null
);

alter table uploaded_lessons enable row level security;

drop policy if exists "teachers insert lessons" on uploaded_lessons;
create policy "teachers insert lessons"
  on uploaded_lessons for insert
  with check (
    (select raw_user_meta_data->>'role' from auth.users where id = auth.uid()) = 'teacher'
  );

drop policy if exists "all read lessons" on uploaded_lessons;
create policy "all read lessons"
  on uploaded_lessons for select
  using (auth.uid() is not null);

drop policy if exists "teachers delete own lessons" on uploaded_lessons;
create policy "teachers delete own lessons"
  on uploaded_lessons for delete
  using (
    auth.uid() = created_by
    and (select raw_user_meta_data->>'role' from auth.users where id = auth.uid()) = 'teacher'
  );

-- ─── assignments ─────────────────────────────────────────────────────────────
create table if not exists assignments (
  id           uuid primary key default gen_random_uuid(),
  created_by   uuid not null references auth.users(id) on delete cascade,
  created_at   timestamptz not null default now(),
  title        text not null,
  description  text,
  due_date     date,
  rubric_path  text   -- path in Supabase Storage bucket 'assignments'
);

alter table assignments enable row level security;

drop policy if exists "teachers insert assignments" on assignments;
create policy "teachers insert assignments"
  on assignments for insert
  with check (
    (select raw_user_meta_data->>'role' from auth.users where id = auth.uid()) = 'teacher'
  );

drop policy if exists "all read assignments" on assignments;
create policy "all read assignments"
  on assignments for select
  using (auth.uid() is not null);

drop policy if exists "teachers update own assignments" on assignments;
create policy "teachers update own assignments"
  on assignments for update
  using (
    auth.uid() = created_by
    and (select raw_user_meta_data->>'role' from auth.users where id = auth.uid()) = 'teacher'
  );

drop policy if exists "teachers delete own assignments" on assignments;
create policy "teachers delete own assignments"
  on assignments for delete
  using (
    auth.uid() = created_by
    and (select raw_user_meta_data->>'role' from auth.users where id = auth.uid()) = 'teacher'
  );

-- ─── assignment_submissions ───────────────────────────────────────────────────
create table if not exists assignment_submissions (
  id            uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references assignments(id) on delete cascade,
  user_id       uuid not null references auth.users(id) on delete cascade,
  user_name     text not null,
  file_path     text not null,
  file_name     text not null,
  submitted_at  timestamptz not null default now()
);

alter table assignment_submissions enable row level security;

drop policy if exists "students insert own submissions" on assignment_submissions;
create policy "students insert own submissions"
  on assignment_submissions for insert
  with check (auth.uid() = user_id);

drop policy if exists "students delete own submissions" on assignment_submissions;
create policy "students delete own submissions"
  on assignment_submissions for delete
  using (auth.uid() = user_id);

drop policy if exists "read submissions" on assignment_submissions;
create policy "read submissions"
  on assignment_submissions for select
  using (
    auth.uid() = user_id
    or (select raw_user_meta_data->>'role' from auth.users where id = auth.uid()) = 'teacher'
  );

-- ─── Storage bucket: assignments ─────────────────────────────────────────────
-- Rubric files go to:   rubrics/{assignment_id}/{filename}
-- Student files go to:  submissions/{assignment_id}/{user_id}/{filename}

insert into storage.buckets (id, name, public)
values ('assignments', 'assignments', false)
on conflict (id) do nothing;

drop policy if exists "authenticated users can upload assignment files" on storage.objects;
create policy "authenticated users can upload assignment files"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'assignments');

drop policy if exists "authenticated users can read assignment files" on storage.objects;
create policy "authenticated users can read assignment files"
  on storage.objects for select to authenticated
  using (bucket_id = 'assignments');

drop policy if exists "authenticated users can update assignment files" on storage.objects;
create policy "authenticated users can update assignment files"
  on storage.objects for update to authenticated
  using (bucket_id = 'assignments')
  with check (bucket_id = 'assignments');
