# Webgaeuer_Server

## Database

The DB Setup follows the instructions from here: https://node-postgres.com/guides/project-structure
Migrations and Seeds for Tests are written via plain SQL to reduce the need of further dependencies.

Currently migrations are run via the command "npm run database".
The migrations itself live within the folder "database/migrations"