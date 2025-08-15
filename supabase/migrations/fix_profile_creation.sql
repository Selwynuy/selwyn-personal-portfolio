-- Create a secure function to create profiles during signup
CREATE OR REPLACE FUNCTION create_profile_on_signup(
  user_id uuid,
  user_email text
)
RETURNS void AS $$
BEGIN
  -- Check if profile already exists
  IF EXISTS (SELECT 1 FROM profiles WHERE id = user_id) THEN
    RETURN; -- Profile already exists, nothing to do
  END IF;
  
  -- Insert new profile (this function runs with elevated privileges)
  INSERT INTO profiles (
    id,
    full_name,
    title,
    bio,
    show_view_counts,
    show_featured_first,
    enable_blog,
    is_admin
  ) VALUES (
    user_id,
    split_part(user_email, '@', 1), -- Use email prefix as default name
    'Full Stack Developer',
    'Passionate developer building modern web applications.',
    true,
    true,
    false,
    false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_profile_on_signup(uuid, text) TO authenticated;
