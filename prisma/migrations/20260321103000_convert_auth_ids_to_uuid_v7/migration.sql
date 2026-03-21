-- Convert Better Auth IDs and related foreign keys from TEXT to UUID safely.
-- This avoids destructive drop/recreate operations on required populated columns.

-- Drop dependent FKs before type conversion
ALTER TABLE "session" DROP CONSTRAINT IF EXISTS "session_userId_fkey";
ALTER TABLE "account" DROP CONSTRAINT IF EXISTS "account_userId_fkey";
ALTER TABLE "admins" DROP CONSTRAINT IF EXISTS "admins_userId_fkey";
ALTER TABLE "merchants" DROP CONSTRAINT IF EXISTS "merchants_userId_fkey";
ALTER TABLE "riders" DROP CONSTRAINT IF EXISTS "riders_userId_fkey";

-- Convert primary keys
ALTER TABLE "users"
  ALTER COLUMN "id" TYPE UUID USING ("id"::uuid);

ALTER TABLE "session"
  ALTER COLUMN "id" TYPE UUID USING ("id"::uuid);

ALTER TABLE "account"
  ALTER COLUMN "id" TYPE UUID USING ("id"::uuid);

ALTER TABLE "verification"
  ALTER COLUMN "id" TYPE UUID USING ("id"::uuid);

-- Convert foreign keys to match users.id UUID type
ALTER TABLE "session"
  ALTER COLUMN "userId" TYPE UUID USING ("userId"::uuid);

ALTER TABLE "account"
  ALTER COLUMN "userId" TYPE UUID USING ("userId"::uuid);

ALTER TABLE "admins"
  ALTER COLUMN "userId" TYPE UUID USING ("userId"::uuid);

ALTER TABLE "merchants"
  ALTER COLUMN "userId" TYPE UUID USING ("userId"::uuid);

ALTER TABLE "riders"
  ALTER COLUMN "userId" TYPE UUID USING ("userId"::uuid);

-- Recreate dropped FKs
ALTER TABLE "session"
  ADD CONSTRAINT "session_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "account"
  ADD CONSTRAINT "account_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "admins"
  ADD CONSTRAINT "admins_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "merchants"
  ADD CONSTRAINT "merchants_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "riders"
  ADD CONSTRAINT "riders_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
