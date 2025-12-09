-- Create processing table for tracking processing workflow
CREATE TABLE IF NOT EXISTS processing (
    id SERIAL PRIMARY KEY,
    livestock_id INTEGER REFERENCES livestock(id) ON DELETE CASCADE,
    batch_number VARCHAR(50) NOT NULL,
    processing_line INTEGER NOT NULL CHECK (processing_line BETWEEN 1 AND 10),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'on_hold')),
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    processed_by INTEGER REFERENCES users(id),
    quality_check_passed BOOLEAN,
    yield_percentage DECIMAL(5, 2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_processing_livestock_id ON processing(livestock_id);
CREATE INDEX IF NOT EXISTS idx_processing_status ON processing(status);
CREATE INDEX IF NOT EXISTS idx_processing_line ON processing(processing_line);
CREATE INDEX IF NOT EXISTS idx_processing_start_time ON processing(start_time DESC);
