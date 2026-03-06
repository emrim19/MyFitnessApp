-- ============================================================
-- MyFitnessApp — initial schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- Shared exercise library (readable by all authenticated users)
CREATE TABLE exercises (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  muscle_group TEXT,
  type         TEXT NOT NULL DEFAULT 'strength' CHECK (type IN ('strength', 'cardio', 'bodyweight')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Workout sessions (one per gym visit)
CREATE TABLE workouts (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date             DATE NOT NULL DEFAULT CURRENT_DATE,
  title            TEXT,
  notes            TEXT,
  duration_minutes INT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Individual sets within a workout
CREATE TABLE workout_sets (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id       UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id      UUID NOT NULL REFERENCES exercises(id),
  set_number       INT NOT NULL,
  reps             INT,
  weight_kg        NUMERIC(6, 2),
  duration_seconds INT,
  distance_meters  NUMERIC(8, 2),
  rpe              INT CHECK (rpe BETWEEN 1 AND 10),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE exercises   ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts    ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sets ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read the exercise library
CREATE POLICY "Authenticated users can read exercises"
  ON exercises FOR SELECT
  TO authenticated
  USING (true);

-- Users manage only their own workouts
CREATE POLICY "Users manage own workouts"
  ON workouts FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users manage sets that belong to their own workouts
CREATE POLICY "Users manage own workout sets"
  ON workout_sets FOR ALL
  TO authenticated
  USING (
    workout_id IN (
      SELECT id FROM workouts WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    workout_id IN (
      SELECT id FROM workouts WHERE user_id = auth.uid()
    )
  );

-- ============================================================
-- Seed: common exercises
-- ============================================================

INSERT INTO exercises (name, muscle_group, type) VALUES
  ('Bench Press',       'chest',     'strength'),
  ('Incline Bench Press','chest',    'strength'),
  ('Squat',             'legs',      'strength'),
  ('Leg Press',         'legs',      'strength'),
  ('Deadlift',          'back',      'strength'),
  ('Romanian Deadlift', 'back',      'strength'),
  ('Pull Up',           'back',      'bodyweight'),
  ('Barbell Row',       'back',      'strength'),
  ('Overhead Press',    'shoulders', 'strength'),
  ('Lateral Raise',     'shoulders', 'strength'),
  ('Dumbbell Curl',     'biceps',    'strength'),
  ('Hammer Curl',       'biceps',    'strength'),
  ('Tricep Pushdown',   'triceps',   'strength'),
  ('Skull Crusher',     'triceps',   'strength'),
  ('Plank',             'core',      'bodyweight'),
  ('Running',           NULL,        'cardio'),
  ('Cycling',           NULL,        'cardio'),
  ('Rowing Machine',    NULL,        'cardio');
