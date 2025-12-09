# Slaughterhouse Management

Simple management app for slaughterhouse operations (users, intake, processing, QC, inventory). This repo contains UI, SQL migration scripts, and basic auth scaffolding.

## Features
- User management (roles: admin, supervisor, intake_operator, processing_operator, quality_control, inventory_manager, viewer)
- SQL migration scripts in `scripts/`
- Local dev setup ready for Supabase integration

## Requirements
- Node.js (16+)
- Git
- Supabase account (for hosted Postgres + Auth)

## Quick start (local)
1. Install deps:
   - PowerShell:
     npm install

2. Create `.env.local` and add Supabase keys (example):
   NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>

3. Run dev server:
   npm run dev

## Connect to Supabase (high level)
1. Create a Supabase project → copy URL and anon/service keys.
2. Enable Email/Password auth in Supabase Auth settings.
3. Run SQL migration scripts from `scripts/` in the Supabase SQL editor (run in order).
4. Configure Row Level Security (RLS) and policies for each table.
5. Replace local auth logic with `@supabase/supabase-js` client (see `lib/`).

Note: current `scripts/001_create_users_table.sql` inserts a plaintext admin password. Replace with proper hashed password and enforce secure signup flows in production.

## Git
- .gitignore is included. To push:
  git init
  git add .
  git commit -m "Initial commit"
  git remote add origin https://github.com/YOUR-USER/slaughterhousemgmt.git
  git branch -M main
  git push -u origin main

## Contributing
- Open an issue or PR.
- Keep secrets out of the repo (.env* are ignored).

## License
Add a LICENSE file or replace this line with your preferred license.
