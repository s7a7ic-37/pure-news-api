const db = require("../connection");
const seed = require("./seed");
const demoData = require("../data/development-data");

const tables = ["articles", "comments", "topics", "users"];

const bootstrapDemo = async (pool = db) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock($1)", [63722137]);
    const { rows } = await client.query(
      "SELECT table_name FROM information_schema.tables " +
      "WHERE table_schema = current_schema() AND table_name = ANY($1::text[])",
      [tables]
    );

    if (rows.length === tables.length) {
      await client.query("COMMIT");
      return "existing";
    }
    if (rows.length !== 0) {
      const error = new Error("Refusing to bootstrap a partially configured database.");
      error.code = "DEMO_SCHEMA_INCOMPLETE";
      throw error;
    }

    await seed(demoData, client);
    await client.query("COMMIT");
    return "seeded";
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

if (require.main === module) {
  bootstrapDemo()
    .then((state) => console.log("Demo database:", state))
    .catch((error) => {
      const code = typeof error.code === "string" && /^[A-Z0-9_]{1,32}$/.test(error.code)
        ? error.code
        : "UNKNOWN";
      console.error("Demo database initialization failed", { code });
      process.exitCode = 1;
    })
    .finally(() => db.end());
}

module.exports = bootstrapDemo;
