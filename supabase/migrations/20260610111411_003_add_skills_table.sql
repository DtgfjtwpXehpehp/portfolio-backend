/*
# Add skills table

Adds a skills table for storing categorized skills with icons.

1. New Tables
- `skills` - id, name, category, icon, created_at

2. Security
- RLS enabled with public read, authenticated write
*/

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    category text NOT NULL,
    icon text,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Skills policies (public read, authenticated write)
DROP POLICY IF EXISTS "anon_read_skills" ON skills;
CREATE POLICY "anon_read_skills" ON skills FOR SELECT
    TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_skills" ON skills;
CREATE POLICY "auth_insert_skills" ON skills FOR INSERT
    TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_skills" ON skills;
CREATE POLICY "auth_update_skills" ON skills FOR UPDATE
    TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_skills" ON skills;
CREATE POLICY "auth_delete_skills" ON skills FOR DELETE
    TO authenticated USING (true);

-- Create index for category ordering
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
