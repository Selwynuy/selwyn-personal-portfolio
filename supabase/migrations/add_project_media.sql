-- Create table for multiple project media (images/videos)
create table if not exists public.project_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  type text not null check (type in ('image','video')),
  url text not null,
  position int not null default 0,
  created_at timestamp with time zone not null default now()
);

-- Helpful index for ordering and lookups
create index if not exists idx_project_media_project_position on public.project_media(project_id, position);

-- RLS
alter table public.project_media enable row level security;

-- Policies mirroring projects
DO $$
BEGIN
  -- select own
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'project_media' AND policyname = 'Users can select their own project media'
  ) THEN
    CREATE POLICY "Users can select their own project media" ON public.project_media
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM public.projects p
          WHERE p.id = project_id AND p.user_id = auth.uid()
        )
      );
  END IF;

  -- insert own via owning project
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'project_media' AND policyname = 'Users can insert media for their projects'
  ) THEN
    CREATE POLICY "Users can insert media for their projects" ON public.project_media
      FOR INSERT WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.projects p
          WHERE p.id = project_id AND p.user_id = auth.uid()
        )
      );
  END IF;

  -- update own
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'project_media' AND policyname = 'Users can update their project media'
  ) THEN
    CREATE POLICY "Users can update their project media" ON public.project_media
      FOR UPDATE USING (
        EXISTS (
          SELECT 1 FROM public.projects p
          WHERE p.id = project_id AND p.user_id = auth.uid()
        )
      );
  END IF;

  -- delete own
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'project_media' AND policyname = 'Users can delete their project media'
  ) THEN
    CREATE POLICY "Users can delete their project media" ON public.project_media
      FOR DELETE USING (
        EXISTS (
          SELECT 1 FROM public.projects p
          WHERE p.id = project_id AND p.user_id = auth.uid()
        )
      );
  END IF;
END $$;
