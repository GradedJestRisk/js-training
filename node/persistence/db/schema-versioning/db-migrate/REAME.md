# db-migrate
Here is an implementation using:
- 12-factor app with no env-loading library
- SQL migrations only (no DSL)

## Setup
Steps:
- install [direnv](https://github.com/direnv/direnv)
- run `direnv allow`
- run `direnv reload`
```shell
❯ direnv reload
direnv: loading /db-migrate/.envrc
direnv: export ~DATABASE_URL
```

## Start database
Run `npm run database:start`

## Create a migration
Run `db-migrate create <MIGRATION_NAME> --sql-file`
