-- ============================================================
-- MyFitnessApp — user-created custom exercises
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- Allow exercises to be owned by a user (null = global/seeded)
ALTER TABLE exercises
  ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop old blanket SELECT policy and replace with one that includes
-- the user's own custom exercises alongside the global library
DROP POLICY "Authenticated users can read exercises" ON exercises;

CREATE POLICY "Users can read global and own exercises"
  ON exercises FOR SELECT
  TO authenticated
  USING (user_id IS NULL OR user_id = auth.uid());

-- Users can insert their own custom exercises
CREATE POLICY "Users can create custom exercises"
  ON exercises FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can delete only their own custom exercises
CREATE POLICY "Users can delete own exercises"
  ON exercises FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());
