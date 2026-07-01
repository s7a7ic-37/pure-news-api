const { Pool } = require("pg");
const { readFileSync } = require("node:fs");
const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});

if (ENV === "production" && !process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set in production");
}
if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}

const config = {
  ...(process.env.DATABASE_URL ? { connectionString: process.env.DATABASE_URL } : {}),
  ...(ENV === "production" ? {
    ssl: {
      rejectUnauthorized: true,
      ...(process.env.PGSSLROOTCERT ? { ca: readFileSync(process.env.PGSSLROOTCERT, "utf8") } : {}),
    },
    max: 2,
  } : {}),
  connectionTimeoutMillis: 10000,
};

module.exports = new Pool(config);
