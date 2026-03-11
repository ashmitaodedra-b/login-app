/**
 * GoFinance seed script
 * Usage: npx tsx scripts/seed.ts
 *
 * Requires in .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join } from "path";
import { config } from "dotenv";

config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

// Extract project ref from URL: https://<ref>.supabase.co
const PROJECT_REF = new URL(SUPABASE_URL).hostname.split(".")[0];

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const DEMO_USERS = [
  { email: "alice@gofinance.dev", password: "Demo1234!", full_name: "Alice Tan" },
  { email: "bob@gofinance.dev",   password: "Demo1234!", full_name: "Bob Lim" },
  { email: "carol@gofinance.dev", password: "Demo1234!", full_name: "Carol Wong" },
  { email: "dan@gofinance.dev",   password: "Demo1234!", full_name: "Dan Ng" },
];

async function runSQL(sql: string, label: string) {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ query: sql }),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    // If 401, management API requires a personal access token — fall back to instructions
    if (res.status === 401 || res.status === 403) {
      return { needsManual: true };
    }
    console.error(`  ✗ ${label} failed (${res.status}):`, body);
    return { error: body };
  }

  console.log(`  ✓ ${label}`);
  return { ok: true };
}

async function createDemoUsers() {
  console.log("Creating demo auth users…");

  const { data: existing } = await supabase.auth.admin.listUsers();
  const existingEmails = new Set(existing?.users?.map((u) => u.email));

  for (const user of DEMO_USERS) {
    if (existingEmails.has(user.email)) {
      console.log(`  ↳ ${user.email} already exists, skipping.`);
      continue;
    }

    const { error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: { full_name: user.full_name },
    });

    if (error) {
      console.error(`  ✗ Failed to create ${user.email}:`, error.message);
    } else {
      console.log(`  ✓ Created ${user.email}`);
    }
  }
}

async function applyMigration() {
  console.log("\nApplying migration schema…");
  const sql = readFileSync(
    join(process.cwd(), "supabase/migrations/20240001000000_initial_schema.sql"),
    "utf8"
  );
  return runSQL(sql, "Initial schema migration");
}

async function applySeed() {
  console.log("\nApplying seed data…");
  const sql = readFileSync(join(process.cwd(), "supabase/seed.sql"), "utf8");
  return runSQL(sql, "Seed data");
}

function printManualInstructions() {
  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Manual SQL steps required
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
The Management API requires a personal access token.

Please run these two SQL files in the Supabase SQL Editor:
  https://supabase.com/dashboard/project/${PROJECT_REF}/sql/new

Step 1 — paste and run:
  supabase/migrations/20240001000000_initial_schema.sql

Step 2 — paste and run:
  supabase/seed.sql
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
}

async function main() {
  console.log("═══════════════════════════════════════");
  console.log("  GoFinance — Seed Script");
  console.log("═══════════════════════════════════════\n");

  await createDemoUsers();

  const migrationResult = await applyMigration();

  if (migrationResult.needsManual) {
    printManualInstructions();
  } else {
    const seedResult = await applySeed();
    if (seedResult.needsManual) {
      printManualInstructions();
    }
  }

  console.log("\n✅ Done.");
  console.log("\nDemo credentials:");
  for (const u of DEMO_USERS) {
    console.log(`  ${u.email}  /  ${u.password}`);
  }
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
