import { neon } from "@neondatabase/serverless";

export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}

// Creates the table on first use, once per server instance. No migration step needed.
let schemaReady: Promise<void> | null = null;

export function ensureSchema(): Promise<void> {
  schemaReady ??= (async () => {
    const sql = getSql();
    await sql`
      create table if not exists subscribers (
        id bigserial primary key,
        email text not null unique,
        unsub_token text not null unique,
        ip_hash text,
        created_at timestamptz not null default now(),
        unsubscribed_at timestamptz,
        notified_at timestamptz
      )`;
    await sql`create index if not exists subscribers_ip_idx on subscribers (ip_hash, created_at)`;
  })().catch((err) => {
    schemaReady = null;
    throw err;
  });
  return schemaReady;
}
