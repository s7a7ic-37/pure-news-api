# Pure News API

Welcome to the Pure News API, an API that serves as the backend for the Pure News platform, providing the necessary endpoints to interact with the application.

## Table of Contents

- [Deployment](#deployment)
- [Frontend Repository](#frontend-repository)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [API Documentation](#api-documentation)

## Deployment

You can access the deployed version of Pure News API [here](pure-news-api.ideanexus.uk/api).

## Frontend Repository

The frontend code for the Pure News provides a user-friendly interface for interacting withthe application. You can find the frontend repository [here](pure-news.ideanexus.uk).

## Prerequisites

Before running Pure News API locally, ensure that you have the following prerequisites installed on your system:

- Node.js (minimum version 19.8.1)
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

For detailed information on the available API endpoints and their request/response structures, refer to the [API Documentation](pure-news-api.ideanexus.uk/api).
