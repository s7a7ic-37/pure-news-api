# Pure News API

Welcome to the Pure News API, an API that serves as the backend for the Pure News platform, providing the necessary endpoints to interact with the application.

## Table of Contents

- [Deployment](#deployment)
- [Frontend Repository](#frontend-repository)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [API Documentation](#api-documentation)

## Deployment

You can access the deployed version of Pure News API [here](https://pure-news-api-1.onrender.com/api).

The endpoint catalogue, topics, articles, article details, comments and users were verified with HTTP 200 against the replacement database. The frontend is available at https://pure-news.netlify.app.

Unexpected failures emit an `Unhandled API error` log with a diagnostic code, such as `ENOTFOUND` or a PostgreSQL error code. Connection strings, error messages and request data are excluded from that log; clients receive a generic server error. Use the code in the hosting logs to investigate connection, authentication or schema failures.

The previous Supabase project was paused beyond dashboard restoration. It remains intact; this demo uses a fresh database initialized with the repository's original public sample data (36 articles and 300 comments), not recovered visitor comments. A fresh demo database can be initialized with:

    npm run bootstrap-demo
    npm start

The bootstrap command holds a transaction lock, initializes only when all four application tables are absent, and skips a complete existing schema. It refuses partial schemas and rolls back failed initialization. The original seed command replaces tables and is intended for disposable local development databases.

In production, set NODE_ENV=production and DATABASE_URL in the hosting environment. The connection verifies the TLS certificate and times out after ten seconds. For a Supabase IPv4 connection, use the Session pooler URI on port 5432. Do not commit that URI or its password.

The URI may omit its password when PGPASSWORD is configured separately. This avoids manually escaping password symbols in a URL.

For Supabase, set PGSSLROOTCERT=db/certs/supabase-prod-ca-2021.crt to trust its published root certificate while retaining certificate and hostname verification. This bundled file is a public CA certificate, not a private key. Its source is the Download certificate link in Supabase Database Settings.

On Render, use this start command to safely initialize an empty replacement demo database before serving requests:

    npm run bootstrap-demo && npm start

GitHub Actions runs the database-backed tests against a disposable PostgreSQL 16 service and exercises both the initial and repeat bootstrap paths.

Article browsing supports opt-in pagination: `/api/articles?topic=coding&sort_by=votes&order=desc&limit=12&p=2`. The response adds `total_count`, `page` and `limit`. Counts respect the topic and remain available beyond the last page. `limit` accepts 1–100 and `p` accepts 1–100000 as decimal whole numbers. Sort ties use article IDs so pages do not overlap when values are equal. Omitting both parameters preserves the original unpaginated response. SQL values are parameterized and sort columns/directions are allowlisted. Offset pagination suits this small fixed demo catalogue; a frequently changing, large feed would need cursor pagination.

This is a public learning demo. Usernames are sample identities, not authenticated accounts; do not submit personal or sensitive information. The free Render instance can take about a minute to wake after inactivity. For a real community, authentication, authorization, abuse controls and operational monitoring would be required.

## Frontend Repository

The frontend code for the Pure News provides a user-friendly interface for interacting withthe application. You can find the frontend repository [here](https://github.com/s7a7ic-37/pure-news).

## Prerequisites

Before running Pure News API locally, ensure that you have the following prerequisites installed on your system:

- Node.js 22 (the version used in CI)
- Postgres (minimum version 14.7)

## Installation

To set up and run the Pure News API locally, follow these steps:

1. Clone the repository:

   ```shell
   git clone https://github.com/s7a7ic-37/pure-news-api.git
   ```

2. Navigate to the project directory:

   ```shell
   cd pure-news-api
   ```

3. Install dependencies:

   ```shell
   npm install
   ```

4. Setup environment variables:

   1. Create a new file called `.env.development` in the root directory of your project.

      - Add the following variable to the file: `PGDATABASE=<name_of_your_development_database>`
      - Replace `<name_of_your_development_database>` with the name of your development database.
      - Save the `.env.development` file.

   2. Create a new file called `.env.test` in the root directory of your project.
      - Add the following variable to the file: `PGDATABASE=<name_of_your_test_database>`
      - Replace `<name_of_your_test_database>` with the name of your test database.
      - Save the `.env.test` file.

   **Note:** Make sure to add the `.env.*` files to your `.gitignore` file to prevent sensitive information such as database passwords from being accidentally committed to the repository.

5. Seed the local database:

   ```shell
   npm run setup-dbs
   ```

   and then

   ```shell
   npm run seed
   ```

6. Run tests (optional):

   ```shell
   npm test
   ```

## API Documentation

For detailed information on the available API endpoints and their request/response structures, refer to the [API Documentation](https://pure-news-api-1.onrender.com/api).
