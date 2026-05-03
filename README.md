# SaveFlow

SaveFlow is a production-quality MVP for tracking savings goals and daily cash flow without the overhead of a full budgeting suite.

## What’s Included

- Next.js 14 App Router app with TypeScript and Tailwind CSS
- Supabase Auth for sign up, login, and session handling
- Savings goals CRUD with progress, remaining amount, and weekly savings guidance
- Income and expense tracking with optional linked goals
- Dashboard summaries, recent activity, and reports built with Recharts
- Supabase SQL schema with RLS policies for per-user data access
- Demo seed script for creating a sample user and realistic test data

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Supabase Auth + Postgres
- React Hook Form + Zod
- Recharts

## Local Setup

1. Create a local environment file:

```bash
touch .env.local
```

2. Fill in:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`

3. In Supabase SQL Editor, run:

- [`supabase/schema.sql`](./supabase/schema.sql)

4. Seed demo data:

```bash
npm run db:seed
```

5. Start the app:

```bash
npm run dev
```

6. Open:

- [http://localhost:3000](http://localhost:3000)

## Demo Credentials

After running the seed script:

- Email: `demo@saveflow.app`
- Password: `SaveFlow123!`

## Database Notes

- All app tables are scoped by `user_id`
- RLS is enabled on `profiles`, `savings_goals`, and `transactions`
- New auth users automatically get a `profiles` row via trigger

## Known Limitations

- Auth email confirmation behavior depends on your Supabase project settings
- Currency support is functional but intentionally lightweight
- Reports are computed in the app layer rather than with dedicated SQL views
