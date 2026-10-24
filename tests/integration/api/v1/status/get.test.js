test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(responseBody.updated_at).toBeDefined();

  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parsedUpdatedAt);

  expect(responseBody.dependencies.database).toBeDefined();
  const databaseProps = responseBody.dependencies.database;

  expect(databaseProps.version).toBeDefined();
  expect(databaseProps.version).toMatch(/^\d+\.\d+$/);
  expect(databaseProps.version).toEqual("16.0");
  const databaseVersion = databaseProps.version;

  expect(databaseProps.max_connections).toBeDefined();
  expect(databaseProps.max_connections).not.toBeNaN();
  expect(databaseProps.max_connections).toBeGreaterThan(0);
  const maxConnections = databaseProps.max_connections;

  expect(databaseProps.opened_connections).toBeDefined();
  expect(databaseProps.opened_connections).not.toBeNaN();
  expect(databaseProps.opened_connections).toEqual(1);
  const openedConnections = databaseProps.opened_connections;

  const expectedDatabaseProps = JSON.stringify({
    version: databaseVersion,
    max_connections: maxConnections,
    opened_connections: openedConnections,
  });

  expect(JSON.stringify(databaseProps)).toStrictEqual(expectedDatabaseProps);
});
