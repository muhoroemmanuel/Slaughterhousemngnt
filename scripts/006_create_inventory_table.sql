-- Create inventory table for product tracking
CREATE TABLE IF NOT EXISTS inventory (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    product_code VARCHAR(50) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL CHECK (quantity >= 0),
    unit VARCHAR(20) NOT NULL,
    storage_location VARCHAR(100),
    temperature_celsius DECIMAL(5, 2),
    expiry_date DATE,
    batch_reference VARCHAR(50),
    processing_id INTEGER REFERENCES processing(id),
    status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'shipped', 'expired', 'recalled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_inventory_product_code ON inventory(product_code);
CREATE INDEX IF NOT EXISTS idx_inventory_category ON inventory(category);
CREATE INDEX IF NOT EXISTS idx_inventory_status ON inventory(status);
CREATE INDEX IF NOT EXISTS idx_inventory_expiry_date ON inventory(expiry_date);
CREATE INDEX IF NOT EXISTS idx_inventory_storage_location ON inventory(storage_location);
