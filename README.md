# NC news

## Setting Up Environment Variables

To set up the necessary environment variables for your development and test databases, follow these steps:

1. Create a new file called .env.development in the root directory of your project.
   - add the following variable to the file: PGDATABASE=<name_of_your_development_database>
   - _replace <name_of_your_development_database> with the name of your test database._
   - save the .env.development file
2. Create a new file called .env.test in the root directory of your project.
   - add the following variable to the file: PGDATABASE=<name_of_your_test_database>
   - _replace <name_of_your_test_database> with the name of your test database._
   - save the .env.test file

_Note:_ Make sure to add the .env.\* files to your .gitignore file to prevent sensitive information such as database passwords from being accidentally committed to the repository.