/*
# Add documents table

Adds a documents table for storing document references (e.g., PDFs, certificates).

1. New Tables
- `documents` - id, name, file_url, type, created_at, updated_at

2. Security
- RLS enabled with public read, authenticated write
*/

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    file_url text,
    type text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Documents policies (public read, authenticated write)
DROP POLICY IF EXISTS "anon_read_documents" ON documents;
CREATE POLICY "anon_read_documents" ON documents FOR SELECT
    TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_documents" ON documents;
CREATE POLICY "auth_insert_documents" ON documents FOR INSERT
    TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_documents" ON documents;
CREATE POLICY "auth_update_documents" ON documents FOR UPDATE
    TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_documents" ON documents;
CREATE POLICY "auth_delete_documents" ON documents FOR DELETE
    TO authenticated USING (true);

-- Apply trigger for updated_at
DROP TRIGGER IF EXISTS update_documents_updated_at ON documents;
CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
