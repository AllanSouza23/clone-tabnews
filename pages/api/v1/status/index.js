import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const databaseVersionRaw = await database.query("SHOW server_version;");
  const databaseVersion = databaseVersionRaw.rows[0].server_version;

  const maxConnectionsRaw = await database.query("SHOW max_connections;");
  const maxConnections = maxConnectionsRaw.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  const openedConnectionsRaw = await database.query({
    text: "SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const openedConnections = openedConnectionsRaw.rows[0].count;

  const databaseProps = {
    version: databaseVersion,
    max_connections: parseInt(maxConnections),
    opened_connections: openedConnections,
  };

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: databaseProps,
    },
  });
}

export default status;
