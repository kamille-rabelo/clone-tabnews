import database from "infra/database.js";

export async function GET() {
  const updatedAt = new Date().toISOString();
  const queryResult = await database.query({
    text: `
    SELECT current_setting('server_version') AS server_version, 
           current_setting('max_connections')::int AS max_connections,
            count(*)::int AS opened_connections 
            FROM pg_stat_activity 
            WHERE datname = $1;
  `,
    values: [process.env.POSTGRES_DB],
  });

  return Response.json({
    status: "ok",
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: queryResult.rows[0].server_version,
        max_connections: queryResult.rows[0].max_connections,
        opened_connections: queryResult.rows[0].opened_connections,
      },
    },
  });
}
