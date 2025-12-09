# Database Schema Scripts

This directory contains SQL scripts to set up the database schema for the Slaughterhouse Management System.

## Scripts Overview

1. **001_create_users_table.sql** - User authentication and management
2. **002_create_audit_logs_table.sql** - System activity tracking
3. **003_create_sessions_table.sql** - User session management
4. **004_create_livestock_table.sql** - Livestock intake tracking
5. **005_create_processing_table.sql** - Processing workflow management
6. **006_create_inventory_table.sql** - Product inventory tracking
7. **007_create_compliance_table.sql** - Compliance and regulatory checks

## Running the Scripts

### For Supabase:
1. Connect your Supabase integration in v0
2. Run each script in order from the v0 interface

### For Neon or other PostgreSQL:
1. Connect your database integration in v0
2. Run each script in order from the v0 interface

### Manual Setup:
If you prefer to run these manually:
\`\`\`bash
psql -U your_username -d your_database -f scripts/001_create_users_table.sql
psql -U your_username -d your_database -f scripts/002_create_audit_logs_table.sql
# ... continue for all scripts
\`\`\`

## Important Notes

- Scripts are designed to be idempotent (safe to run multiple times)
- The default admin password is 'admin123' - **CHANGE THIS IN PRODUCTION**
- In production, use proper password hashing (bcrypt, argon2, etc.)
- Consider setting up Row Level Security (RLS) policies for Supabase
- Regular backups are recommended

## Schema Relationships

\`\`\`
users
  ├── sessions (user sessions)
  ├── audit_logs (activity tracking)
  ├── livestock (received_by)
  ├── processing (processed_by)
  └── compliance_checks (inspector_id)

livestock
  └── processing (livestock_id)
      └── inventory (processing_id)

compliance_checks
  ├── livestock (reference)
  ├── processing (reference)
  └── inventory (reference)
\`\`\`

## Security Considerations

1. **Password Storage**: Use bcrypt or argon2 for password hashing
2. **Session Management**: Implement session expiration and cleanup
3. **Audit Logging**: All sensitive operations should be logged
4. **Access Control**: Implement Row Level Security (RLS) policies
5. **Data Encryption**: Consider encrypting sensitive fields at rest
