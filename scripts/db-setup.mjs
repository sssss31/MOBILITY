// Applies the Drizzle SQL migrations in ./drizzle to the configured Turso/libSQL
// database. Run with: npm run db:setup
//
// Reads TURSO_DATABASE_URL / TURSO_AUTH_TOKEN from the environment. If a
// .env.local or .env file is present, it is loaded automatically.
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@libsql/client";

for (const file of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(file);
  } catch {
    // no such file — ignore
  }
}

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
if (!url) {
  console.error("TURSO_DATABASE_URL is not set. Add it to .env.local or your shell before running db:setup.");
  process.exit(1);
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const drizzleDir = join(root, "drizzle");
const files = readdirSync(drizzleDir)
  .filter((f) => f.endsWith(".sql"))
  .sort();

const client = createClient({ url, authToken });

for (const file of files) {
  const sql = readFileSync(join(drizzleDir, file), "utf8");
  const statements = sql
    .split("--> statement-breakpoint")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const statement of statements) {
    try {
      await client.execute(statement);
    } catch (error) {
      if (/already exists/i.test(String(error))) continue;
      console.error(`Failed on statement from ${file}:\n${statement}\n`);
      throw error;
    }
  }
  console.log(`Applied ${file}`);
}

console.log("Database schema ready.");
