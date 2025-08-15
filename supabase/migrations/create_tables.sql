-- Create profiles table (extends auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  title text,
  bio text,
  github_url text,
  linkedin_url text,
  twitter_url text,
  show_view_counts boolean default true,
  show_featured_first boolean default true,
  enable_blog boolean default false,
  meta_title text,
  meta_description text,
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create projects table
create table projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  content text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  featured boolean default false,
  technologies text[] default '{}',
  github_url text,
  live_url text,
  image_url text,
  view_count integer default 0,
  user_id uuid references auth.users on delete cascade not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create messages table
create table messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  subject text,
  message text not null,
  status text not null default 'unread' check (status in ('unread', 'read', 'archived')),
  user_id uuid references auth.users on delete cascade not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS (Row Level Security)
alter table profiles enable row level security;
alter table projects enable row level security;
alter table messages enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Published projects are viewable by everyone"
  on projects for select
  using (status = 'published' or auth.uid() = user_id);

create policy "Users can manage their own projects"
  on projects for all
  using (auth.uid() = user_id);

create policy "Users can view their own messages"
  on messages for select
  using (auth.uid() = user_id);

create policy "Anyone can create a message"
  on messages for insert
  with check (true);

create policy "Users can manage their own messages"
  on messages for update
  using (auth.uid() = user_id);

-- Create functions
create or replace function increment_view_count(project_id uuid)
returns void as $$
begin
  update projects
  set view_count = view_count + 1
  where id = project_id;
end;
$$ language plpgsql security definer;
