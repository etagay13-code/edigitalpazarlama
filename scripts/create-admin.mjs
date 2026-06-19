// İlk admin kullanıcısını oluşturur. Bir kere çalıştırılır.
// Kullanım: node --env-file=.env.local scripts/create-admin.mjs <email> <password> [full-name]
import { createClient } from "@supabase/supabase-js";

const [email, password, fullName = "Admin"] = process.argv.slice(2);

if (!email || !password) {
  console.error("Usage: node scripts/create-admin.mjs <email> <password> [full-name]");
  process.exit(1);
}

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Supabase env değişkenleri eksik. .env.local'ı kontrol et.");
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true, // Mail onayını atla (domain mail kutusu olmayabilir)
  user_metadata: { full_name: fullName },
});

if (error) {
  console.error("✗ Failed:", error.message);
  process.exit(1);
}

console.log(`✓ Admin user created`);
console.log(`  ID:    ${data.user.id}`);
console.log(`  Email: ${data.user.email}`);
console.log(`  Name:  ${fullName}`);
