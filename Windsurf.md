## To Buy App Context

This project includes a To Buy application with two separate todo lists: one for general items and another for items needed immediately. The application allows users to add, delete, edit (by double-clicking), and cross off items from their lists. Data is now stored in a Supabase database for shared access across all users without authentication.

### Features

- Add items to buy
- Delete items
- Edit items by double-clicking the text
- Toggle completion (cross off) items
- Shared database storage with Supabase (no authentication required)
- Two separate lists: General and Now

### Backend

- Database: Supabase (PostgreSQL)
- API: Next.js API routes
- No authentication - public access to all operations

### Setup

1. Create a Supabase project at https://supabase.com
2. Run the following SQL in the Supabase SQL editor:

```sql
CREATE TABLE todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  list_type TEXT NOT NULL CHECK (list_type IN ('general', 'now')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (no auth required)
CREATE POLICY "Allow all operations for everyone" ON todos
FOR ALL USING (true);
```

3. Update `.env.local` with your Supabase URL and anon key.

### Rule

Every new feature or item added to the project must be documented in this context file to ensure clarity and maintainability.
