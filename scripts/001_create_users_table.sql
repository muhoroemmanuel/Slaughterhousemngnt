-- Create users table for authentication and user management
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'supervisor', 'intake_operator', 'processing_operator', 'quality_control', 'inventory_manager', 'viewer')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create index on role for permission checks
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Insert default admin user (password: admin123 - should be changed in production)
-- Note: In production, use proper password hashing (bcrypt, argon2, etc.)
INSERT INTO users (email, full_name, password_hash, role) 
VALUES ('admin@slaughterhouse.com', 'System Administrator', 'admin123', 'admin')
ON CONFLICT (email) DO NOTHING;
