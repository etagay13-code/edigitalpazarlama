// Supabase Postgres'e doğrudan bağlanıp SQL dosyası çalıştırır.
// Kullanım: npm run db:migrate -- <sql-dosyası>
// Veya:     node --env-file=.env.local scripts/migrate.mjs <sql-dosyası>
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import pg from "pg";

const { Client } = pg;

const sqlPath = process.argv[2];
if (!sqlPath) {
  console.error("Usage: node scripts/migrate.mjs <path-to-sql-file>");
  process.exit(1);
}

const absPath = resolve(process.cwd(), sqlPath);
const sql = readFileSync(absPath, "utf-8");

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL env değişkeni yok. .env.local'ı kontrol et.");
  process.exit(1);
}

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

try {
  console.log(`🔌  Connecting to Supabase…`);
  await client.connect();
  console.log(`📜  Running ${sqlPath} (${sql.length.toLocaleString()} chars)…`);
  await client.query(sql);
  console.log(`✓   Migration applied successfully.`);
} catch (err) {
  console.error(`✗   Migration failed:`);
  console.error(err.message);
  if (err.position) console.error(`   SQL position: ${err.position}`);
  if (err.detail) console.error(`   Detail: ${err.detail}`);
  if (err.hint) console.error(`   Hint: ${err.hint}`);
  process.exit(1);
} finally {
  await client.end();
}
