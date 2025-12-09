-- Create compliance table for regulatory tracking
CREATE TABLE IF NOT EXISTS compliance_checks (
    id SERIAL PRIMARY KEY,
    check_type VARCHAR(100) NOT NULL,
    reference_id INTEGER,
    reference_type VARCHAR(50) CHECK (reference_type IN ('livestock', 'processing', 'inventory', 'facility')),
    inspector_id INTEGER REFERENCES users(id),
    check_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'passed', 'failed', 'requires_action')),
    findings TEXT,
    corrective_actions TEXT,
    follow_up_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_compliance_check_type ON compliance_checks(check_type);
CREATE INDEX IF NOT EXISTS idx_compliance_status ON compliance_checks(status);
CREATE INDEX IF NOT EXISTS idx_compliance_check_date ON compliance_checks(check_date DESC);
CREATE INDEX IF NOT EXISTS idx_compliance_reference ON compliance_checks(reference_type, reference_id);
