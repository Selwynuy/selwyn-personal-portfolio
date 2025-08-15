-- Drop the manual function since we're using triggers now
DROP FUNCTION IF EXISTS create_profile_on_signup(uuid, text);

-- Create a trigger function to automatically create profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    full_name,
    title,
    bio,
    show_view_counts,
    show_featured_first,
    enable_blog,
    is_admin
  ) VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'Full Stack Developer',
    'Passionate developer building modern web applications.',
    true,
    true,
    false,
    false
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger that fires when a new user is created in auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Also create a trigger for when user email is confirmed (this ensures profile exists)
CREATE OR REPLACE FUNCTION public.handle_user_email_confirmed()
RETURNS trigger AS $$
BEGIN
  -- Only create profile if it doesn't exist and email is confirmed
  IF new.email_confirmed_at IS NOT NULL AND old.email_confirmed_at IS NULL THEN
    INSERT INTO public.profiles (
      id,
      full_name,
      title,
      bio,
      show_view_counts,
      show_featured_first,
      enable_blog,
      is_admin
    ) VALUES (
      new.id,
      COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
      'Full Stack Developer',
      'Passionate developer building modern web applications.',
      true,
      true,
      false,
      false
    )
    ON CONFLICT (id) DO NOTHING; -- Ignore if profile already exists
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_email_confirmed();
