jest.mock("pg", () => ({ Pool: jest.fn() }));
jest.mock("dotenv", () => ({ config: jest.fn() }));

const original = {
  NODE_ENV: process.env.NODE_ENV,
  PGDATABASE: process.env.PGDATABASE,
  DATABASE_URL: process.env.DATABASE_URL,
  PGSSLROOTCERT: process.env.PGSSLROOTCERT,
};

beforeEach(() => {
  jest.resetModules();
  process.env.NODE_ENV = "test";
  process.env.PGDATABASE = "isolated_test";
  delete process.env.DATABASE_URL;
  delete process.env.PGSSLROOTCERT;
});

afterAll(() => {
  for (const [key, value] of Object.entries(original)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

const config = () => {
  require("../db/connection");
  return require("pg").Pool.mock.calls[0][0];
};

it("uses PG environment settings for a local database and bounds connection time", () => {
  expect(config()).toEqual({ connectionTimeoutMillis: 10000 });
});

it("honours an explicitly supplied local connection URL", () => {
  process.env.DATABASE_URL = "postgresql://demo:example@localhost/demo";
  expect(config().connectionString).toBe(process.env.DATABASE_URL);
});

it("requires a production URL even if a local database name exists", () => {
  process.env.NODE_ENV = "production";
  expect(config).toThrow("DATABASE_URL must be set in production");
});

it("verifies the production TLS certificate and keeps the pool small", () => {
  process.env.NODE_ENV = "production";
  process.env.DATABASE_URL = "postgresql://demo:example@database.invalid/demo";
  expect(config()).toEqual({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: true },
    max: 2,
    connectionTimeoutMillis: 10000,
  });
});

it("loads an explicit provider CA without disabling certificate verification", () => {
  process.env.NODE_ENV = "production";
  process.env.DATABASE_URL = "postgresql://demo@database.invalid/demo";
  process.env.PGSSLROOTCERT = require("node:path").join(
    __dirname, "../db/certs/supabase-prod-ca-2021.crt"
  );
  const ssl = config().ssl;
  expect(ssl.rejectUnauthorized).toBe(true);
  expect(new (require("node:crypto").X509Certificate)(ssl.ca).ca).toBe(true);
});
