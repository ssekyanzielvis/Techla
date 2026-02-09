-- ================================================
-- TECHLA SOLUTIONS - SUPABASE DATABASE SETUP
-- ================================================
-- Run this SQL in your Supabase SQL Editor
-- ================================================

-- Create the documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  document_number TEXT NOT NULL,
  date DATE NOT NULL,
  to_field TEXT NOT NULL,
  items JSONB NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  vat DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  amount_in_words TEXT NOT NULL,
  signature TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_documents_type ON documents(type);
CREATE INDEX idx_documents_date ON documents(date);
CREATE INDEX idx_documents_created_at ON documents(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for development)
-- WARNING: This allows all operations without authentication
-- For production, implement user-specific policies
CREATE POLICY "Allow all operations" ON documents
  FOR ALL USING (true);

-- ================================================
-- VERIFICATION QUERIES
-- ================================================

-- Check if table was created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'documents';

-- Check table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'documents' 
ORDER BY ordinal_position;

-- Check indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'documents';

-- Check RLS policies
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'documents';

-- ================================================
-- SAMPLE INSERT (for testing)
-- ================================================

INSERT INTO documents (
  type,
  document_number,
  date,
  to_field,
  items,
  subtotal,
  vat,
  total,
  amount_in_words,
  signature
) VALUES (
  'invoice',
  'INV-001',
  '2026-02-09',
  'Test Client Ltd.',
  '[
    {
      "id": "1",
      "itemNumber": "1",
      "description": "Web Development Services",
      "quantity": 10,
      "rate": 50000,
      "amount": 500000
    }
  ]'::jsonb,
  500000.00,
  90000.00,
  590000.00,
  'Five Hundred Ninety Thousand Only',
  'John Doe'
);

-- ================================================
-- USEFUL QUERIES
-- ================================================

-- View all documents
SELECT * FROM documents ORDER BY created_at DESC;

-- Count documents by type
SELECT type, COUNT(*) as count 
FROM documents 
GROUP BY type;

-- Get total amount by type
SELECT type, SUM(total) as total_amount 
FROM documents 
GROUP BY type;

-- Delete all test data (use with caution!)
-- DELETE FROM documents;

-- ================================================
-- PRODUCTION SETUP (OPTIONAL)
-- ================================================

-- For production, you might want user-specific policies
-- Example (requires auth.users table):

-- Drop the allow-all policy
-- DROP POLICY "Allow all operations" ON documents;

-- Create user-specific policy
-- CREATE POLICY "Users can manage own documents" ON documents
--   FOR ALL USING (auth.uid() = user_id);

-- Add user_id column (if implementing user auth)
-- ALTER TABLE documents ADD COLUMN user_id UUID REFERENCES auth.users(id);
-- CREATE INDEX idx_documents_user_id ON documents(user_id);

-- ================================================
-- END OF SQL SETUP
-- ================================================
