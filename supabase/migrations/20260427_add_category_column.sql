-- Add category column to records table
ALTER TABLE records ADD COLUMN category TEXT DEFAULT '其他';

-- Index on category for faster aggregation
CREATE INDEX idx_records_category ON records(category);
