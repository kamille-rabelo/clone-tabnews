import migrationsRunner from "node-pg-migrate";
import { join } from "node:path";

export async function GET(req) {
  const migrations = await migrationsRunner({
    dir: join("infra", "migrations"),
    databaseUrl: process.env.DATABASE_URL,
    direction: "up",
    verbose: true,
    dryRun: true,
    migrationsTable: "pgmigrations",
  });

  return Response.json(migrations);
}
