/*
# Portfolio Database Schema

Creates tables for a portfolio website backend:
- projects: Portfolio projects with title, description, URLs, and technologies
- about: About section with personal info, bio, and skills
- contact: Contact information (email, phone, social links)
- resume: Resume entries (experience, education, etc.)

This is a single-tenant application without user authentication.
All data is publicly readable via the API, but writes are restricted to authenticated users.

1. New Tables
- `projects` - id, title, description, image_url, github_url, live_url, technologies (JSON), timestamps
- `about` - id, name, title, content, image_url, skills (JSON), timestamps
- `contact` - id, email, phone, linkedin_url, github_url, timestamps
- `resume` - id, category, title, organization, start_date, end_date, description, order_index, timestamps

2. Security
- RLS enabled on all tables
- Public read access (anon + authenticated) for GET requests
- Write access restricted to authenticated users only
*/

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    image_url text,
    github_url text,
    live_url text,
    technologies jsonb DEFAULT '[]'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- About table
CREATE TABLE IF NOT EXISTS about (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    title text,
    content text,
    image_url text,
    skills jsonb DEFAULT '[]'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Contact table
CREATE TABLE IF NOT EXISTS contact (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text,
    phone text,
    linkedin_url text,
    github_url text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Resume table
CREATE TABLE IF NOT EXISTS resume (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    category text NOT NULL,
    title text NOT NULL,
    organization text,
    start_date date,
    end_date date,
    description text,
    order_index integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume ENABLE ROW LEVEL SECURITY;

-- Projects policies (public read, authenticated write)
DROP POLICY IF EXISTS "anon_read_projects" ON projects;
CREATE POLICY "anon_read_projects" ON projects FOR SELECT
    TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_projects" ON projects;
CREATE POLICY "auth_insert_projects" ON projects FOR INSERT
    TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_projects" ON projects;
CREATE POLICY "auth_update_projects" ON projects FOR UPDATE
    TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_projects" ON projects;
CREATE POLICY "auth_delete_projects" ON projects FOR DELETE
    TO authenticated USING (true);

-- About policies (public read, authenticated write)
DROP POLICY IF EXISTS "anon_read_about" ON about;
CREATE POLICY "anon_read_about" ON about FOR SELECT
    TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_about" ON about;
CREATE POLICY "auth_insert_about" ON about FOR INSERT
    TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_about" ON about;
CREATE POLICY "auth_update_about" ON about FOR UPDATE
    TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_about" ON about;
CREATE POLICY "auth_delete_about" ON about FOR DELETE
    TO authenticated USING (true);

-- Contact policies (public read, authenticated write)
DROP POLICY IF EXISTS "anon_read_contact" ON contact;
CREATE POLICY "anon_read_contact" ON contact FOR SELECT
    TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_contact" ON contact;
CREATE POLICY "auth_insert_contact" ON contact FOR INSERT
    TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_contact" ON contact;
CREATE POLICY "auth_update_contact" ON contact FOR UPDATE
    TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_contact" ON contact;
CREATE POLICY "auth_delete_contact" ON contact FOR DELETE
    TO authenticated USING (true);

-- Resume policies (public read, authenticated write)
DROP POLICY IF EXISTS "anon_read_resume" ON resume;
CREATE POLICY "anon_read_resume" ON resume FOR SELECT
    TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_resume" ON resume;
CREATE POLICY "auth_insert_resume" ON resume FOR INSERT
    TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_resume" ON resume;
CREATE POLICY "auth_update_resume" ON resume FOR UPDATE
    TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_resume" ON resume;
CREATE POLICY "auth_delete_resume" ON resume FOR DELETE
    TO authenticated USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers for updated_at
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_about_updated_at ON about;
CREATE TRIGGER update_about_updated_at
    BEFORE UPDATE ON about
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_contact_updated_at ON contact;
CREATE TRIGGER update_contact_updated_at
    BEFORE UPDATE ON contact
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_resume_updated_at ON resume;
CREATE TRIGGER update_resume_updated_at
    BEFORE UPDATE ON resume
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default records for about and contact
INSERT INTO about (name, title, content, skills)
SELECT 'Your Name', 'Full Stack Developer', 'Welcome to my portfolio!', '["JavaScript", "TypeScript", "React", "Node.js"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM about LIMIT 1);

INSERT INTO contact (email, phone, linkedin_url, github_url)
SELECT 'your.email@example.com', '+1 (555) 123-4567', 'https://linkedin.com/in/yourprofile', 'https://github.com/yourusername'
WHERE NOT EXISTS (SELECT 1 FROM contact LIMIT 1);
