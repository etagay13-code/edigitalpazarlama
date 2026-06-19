// İlk seed: hardcoded içerikleri Supabase'e yükler.
// Bir kere çalıştırılır. Çift çalıştırmak güvenlidir (ON CONFLICT/upsert).
// Kullanım: npm run db:seed
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import pg from "pg";

const { Client } = pg;

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL yok. .env.local'ı kontrol et.");
  process.exit(1);
}

const sqlFile = resolve(process.cwd(), "supabase/seed.sql");
const sql = readFileSync(sqlFile, "utf-8");

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  console.log(`📦  Seeding ${sqlFile.length.toLocaleString()} chars…`);
  await client.query(sql);
  console.log(`✓   Seed complete.`);
} catch (err) {
  console.error(`✗   Seed failed:`, err.message);
  process.exit(1);
} finally {
  await client.end();
}
