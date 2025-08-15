-- Add admin role to profiles table
ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;

-- Drop existing conflicting policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Create functions first (they need to exist before policies reference them)
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_id AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create comprehensive admin role policies
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users and admins can update profiles"
  ON profiles FOR UPDATE
  USING (auth.uid() = id OR is_admin(auth.uid()));

CREATE POLICY "Only admins can delete profiles"
  ON profiles FOR DELETE
  USING (is_admin(auth.uid()));

-- Create admin-only policies for projects
CREATE POLICY "Only admins can manage all projects"
  ON projects FOR ALL
  USING (is_admin(auth.uid()) OR auth.uid() = user_id);

-- Create admin-only policies for messages
CREATE POLICY "Only admins can view all messages"
  ON messages FOR SELECT
  USING (is_admin(auth.uid()) OR auth.uid() = user_id);

CREATE POLICY "Anyone can create a message"
  ON messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only admins can manage all messages"
  ON messages FOR UPDATE
  USING (is_admin(auth.uid()) OR auth.uid() = user_id);

-- Function to make a user admin (only callable by existing admins)
CREATE OR REPLACE FUNCTION make_admin(target_user_id uuid)
RETURNS VOID AS $$
BEGIN
  -- Check if the current user is an admin
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can make other users admin';
  END IF;
  
  UPDATE profiles 
  SET is_admin = true 
  WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
