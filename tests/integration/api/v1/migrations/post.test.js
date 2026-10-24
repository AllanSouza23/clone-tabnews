import database from "infra/database.js";

beforeAll(cleanDatabase);

async function cleanDatabase() {
  await database.query("DROP schema public cascade; CREATE schema public;");
}

test("POST to /api/v1/migrations should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response.status).toBe(201);

  const responseBody = await response.json();

  expect(Array.isArray(responseBody)).toBe(true);

  const migration = await database.query(
    "SELECT COUNT(*)::int from public.pgmigrations;",
  );

  expect(migration.rows[0].count).toBeGreaterThanOrEqual(1);
  expect(migration.rows[0].count).toEqual(responseBody.length);

  const retryResponse = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(retryResponse.status).toBe(200);

  const retryResponseBody = await retryResponse.json();

  const retryMigration = await database.query(
    "SELECT COUNT(*)::int from public.pgmigrations;",
  );

  expect(retryMigration.rows[0].count).toBeGreaterThanOrEqual(1);
  expect(retryResponseBody.length).toEqual(0);
});
