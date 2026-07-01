jest.mock("../db/seeds/seed", () => jest.fn().mockResolvedValue());
const seed = require("../db/seeds/seed");
const bootstrapDemo = require("../db/seeds/bootstrap-demo");

const connection = (existingTables) => {
  const client = {
    query: jest.fn().mockImplementation((sql) =>
      Promise.resolve({
        rows: sql.includes("information_schema.tables")
          ? existingTables.map((table_name) => ({ table_name }))
          : [],
      })
    ),
    release: jest.fn(),
  };
  return { client, pool: { connect: jest.fn().mockResolvedValue(client) } };
};

beforeEach(() => jest.clearAllMocks());

it("initializes an empty schema on the locked transaction connection", async () => {
  const { client, pool } = connection([]);
  await expect(bootstrapDemo(pool)).resolves.toBe("seeded");
  expect(client.query.mock.calls[0][0]).toBe("BEGIN");
  expect(client.query.mock.calls[1][0]).toContain("pg_advisory_xact_lock");
  expect(seed).toHaveBeenCalledWith(expect.any(Object), client);
  expect(client.query).toHaveBeenLastCalledWith("COMMIT");
  expect(client.release).toHaveBeenCalledTimes(1);
});

it("leaves a complete existing schema and its data untouched", async () => {
  const { client, pool } = connection(["articles", "comments", "topics", "users"]);
  await expect(bootstrapDemo(pool)).resolves.toBe("existing");
  expect(seed).not.toHaveBeenCalled();
  expect(client.query).toHaveBeenLastCalledWith("COMMIT");
});

it("refuses a partial schema instead of dropping or replacing tables", async () => {
  const { client, pool } = connection(["articles"]);
  await expect(bootstrapDemo(pool)).rejects.toMatchObject({ code: "DEMO_SCHEMA_INCOMPLETE" });
  expect(seed).not.toHaveBeenCalled();
  expect(client.query).toHaveBeenLastCalledWith("ROLLBACK");
  expect(client.release).toHaveBeenCalledTimes(1);
});

it("rolls back a failed seed and releases the connection", async () => {
  const { client, pool } = connection([]);
  seed.mockRejectedValueOnce(new Error("Failed sample insert"));
  await expect(bootstrapDemo(pool)).rejects.toThrow("Failed sample insert");
  expect(client.query).toHaveBeenLastCalledWith("ROLLBACK");
  expect(client.query).not.toHaveBeenCalledWith("COMMIT");
  expect(client.release).toHaveBeenCalledTimes(1);
});
