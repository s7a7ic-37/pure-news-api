# Pure News API

An Express and PostgreSQL REST API for articles, topics, comments, users and voting.

**[API endpoint catalogue](https://pure-news-api-1.onrender.com/api)** · **[Frontend](https://github.com/s7a7ic-37/pure-news)** · **[Live app](https://pure-news.netlify.app/)**

## Features

- Filter and sort articles, fetch details and read comment threads.
- Create/delete comments and update article votes.
- Parameterized SQL, validated inputs and consistent error responses.
- Database-backed integration tests and transactional demo initialization.

Article pagination is optional:

```text
GET /api/articles?topic=coding&sort_by=votes&order=desc&limit=12&p=2
```

Paginated responses include `total_count`, `page` and `limit`. Limits are 1–100; pages are 1–100000. Providing either parameter defaults the other to 12 or 1. Omitting both returns the unpaginated result. Sort ties use article IDs.

## Run locally

Requires Node.js 22 and PostgreSQL 14.7 or later.

```sh
npm ci
```

Create two untracked environment files:

- `.env.development`: `PGDATABASE=nc_news`
- `.env.test`: `PGDATABASE=nc_news_test`

Set local PostgreSQL connection variables if required, then run:

```sh
npm run setup-dbs
npm run seed
npm test
npm start
```

`setup-dbs` drops and recreates these two local databases. `seed` replaces application tables; use disposable development data.

## Production configuration

Set `NODE_ENV=production` and `DATABASE_URL` in the hosting environment. Keep credentials out of Git. `PGPASSWORD` may supply the password separately from the URI.

TLS certificate verification is enabled. For Supabase, use an IPv4-compatible Session pooler connection on port 5432 and set `PGSSLROOTCERT=db/certs/supabase-prod-ca-2021.crt` for the bundled public CA certificate.

`npm run bootstrap-demo` initializes the public sample dataset only when all four application tables are absent. It skips a complete schema, refuses a partial schema and rolls back failures. The hosted start command is `npm run bootstrap-demo && npm start`.

## Demo notes

Usernames are sample identities, not authenticated accounts. Avoid personal data. The free Render instance may sleep. Server errors expose a generic response; hosting logs contain diagnostic codes without connection strings or request data.
