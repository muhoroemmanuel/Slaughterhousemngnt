-- Create livestock table for intake management
CREATE TABLE IF NOT EXISTS livestock (
    id SERIAL PRIMARY KEY,
    batch_number VARCHAR(50) UNIQUE NOT NULL,
    animal_type VARCHAR(50) NOT NULL CHECK (animal_type IN ('cattle', 'pig', 'sheep', 'goat', 'poultry')),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    source_farm VARCHAR(255) NOT NULL,
    arrival_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    health_status VARCHAR(50) DEFAULT 'pending' CHECK (health_status IN ('pending', 'approved', 'quarantine', 'rejected')),
    weight_kg DECIMAL(10, 2),
    notes TEXT,
    received_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_livestock_batch_number ON livestock(batch_number);
CREATE INDEX IF NOT EXISTS idx_livestock_animal_type ON livestock(animal_type);
CREATE INDEX IF NOT EXISTS idx_livestock_health_status ON livestock(health_status);
CREATE INDEX IF NOT EXISTS idx_livestock_arrival_date ON livestock(arrival_date DESC);
