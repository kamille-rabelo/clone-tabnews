import migrationsRunner from "node-pg-migrate";
import { join } from "node:path";

const defaultMigrationsOptions = {
  dir: join("infra", "migrations"),
  databaseUrl: process.env.DATABASE_URL,
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

export async function GET(req) {
  const pendingMigrations = await migrationsRunner({
    ...defaultMigrationsOptions,
    dryRun: true,
  });

  return Response.json(pendingMigrations);
}

export async function POST(req) {
  try {
    const migratedMigrations = await migrationsRunner(defaultMigrationsOptions);
    const status = migratedMigrations.length > 0 ? 201 : 200;

    return Response.json(migratedMigrations, { status });
  } catch (error) {
    console.error("Migration error:", error);
    return Response.json({ error: "Migration failed" }, { status: 500 });
  }
}
