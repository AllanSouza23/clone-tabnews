import migrator from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

export default async function migrations(request, response) {
  if (!(request.method === "GET" || request.method === "POST")) {
    return response.status(405).end();
  }

  const dbClient = await database.getNewClient();

  const defaultMigrationOptions = {
    dbClient: dbClient,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  if (request.method === "GET") {
    const pendingMigrations = await migrator(defaultMigrationOptions);
    await dbClient.end();
    return response.status(200).json(pendingMigrations);
  } else if (request.method === "POST") {
    const completedMigrations = await migrator({
      ...defaultMigrationOptions,
      dryRun: false,
    });

    await dbClient.end();

    if (completedMigrations.length > 0) {
      return response.status(201).json(completedMigrations);
    }
    return response.status(200).json(completedMigrations);
  }
  return response.status(405).end();
}
