import migrationsRunner from "node-pg-migrate";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import database from "infra/database";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const defaultMigrationsOptions = {
  dir: join(__dirname, "../../../../infra", "migrations"),
  databaseUrl: process.env.DATABASE_URL,
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

export async function GET(req) {
  const dbClient = await database.getNewClient();
  const pendingMigrations = await migrationsRunner({
    ...defaultMigrationsOptions,
    dbClient,
    dryRun: true,
  });

  await dbClient.end();

  return Response.json(pendingMigrations);
}

export async function POST(req) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();
    const migratedMigrations = await migrationsRunner({
      ...defaultMigrationsOptions,
      dbClient,
    });
    const status = migratedMigrations.length > 0 ? 201 : 200;

    return Response.json(migratedMigrations, { status });
  } catch (error) {
    console.error("Migration error:", error);
    return Response.json({ error: "Migration failed" }, { status: 500 });
  } finally {
    await dbClient.end();
  }
}
