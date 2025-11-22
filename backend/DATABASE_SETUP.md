# Backend Startup Issue - PostgreSQL Connection

## Error
```
sqlalchemy.exc.OperationalError: [Errno 11001] getaddrinfo failed
```

The backend can't connect to PostgreSQL database.

## Solutions

### Option 1: Use SQLite (Simplest)
Switch back to SQLite for local development:
1. Edit `backend/.env`
2. Change `DATABASE_URL` to: `sqlite:///./taskflow.db`

### Option 2: Setup PostgreSQL Locally
1. Install PostgreSQL from https://www.postgresql.org/download/
2. Create database: `createdb taskflow`
3. Update `backend/.env` with:
   ```
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/taskflow
   ```

### Option 3: Use Cloud PostgreSQL (Free)
**Supabase** (Recommended):
1. Go to https://supabase.com
2. Create free project
3. Get connection string from Settings → Database
4. Update `backend/.env`

**Neon**:
1. Go to https://neon.tech
2. Create free project
3. Copy connection string
4. Update `backend/.env`

## Current Status
- ✅ Virtual environment: Active
- ✅ Dependencies: Installed
- ❌ Database: Not connected
