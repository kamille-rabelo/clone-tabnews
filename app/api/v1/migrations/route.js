import migrationsRunner from "node-pg-migrate";
import { join, resolve } from "node:path";
import database from "infra/database";

const defaultMigrationsOptions = {
  dir: join(resolve("."), "infra", "migrations"),
  databaseUrl: process.env.DATABASE_URL,
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

export async function GET() {
  let dbClient;

  try {
    dbClient = await database.getNewClient();
    const pendingMigrations = await migrationsRunner({
      ...defaultMigrationsOptions,
      dbClient,
      dryRun: true,
    });

    return Response.json(pendingMigrations);
  } catch (error) {
    console.error("Migration error:", error);
    return Response.json({ error: "Migration failed" }, { status: 500 });
  } finally {
    await dbClient.end();
  }
}

export async function POST() {
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
