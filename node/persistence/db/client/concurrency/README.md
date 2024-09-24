# Concurrency

Demonstrate how contention may occur in database client.

## Configure

Modify `max_connexions` in PG configuration
```shell
vi database-configurations/eight-connexions/postgresql.conf
```
You need at least 5 connexions for database internal processes :
- autovacuum launcher ;
- logical replication launcher ;
- background writer ;
- checkpointer ;
- walwriter .

```sql
SELECT
    backend_type, state, wait_event
FROM pg_stat_activity prc
WHERE 1=1
  AND prc.backend_type <> 'client backend'
ORDER BY backend_type ASC
;
```

## Start container

All queries are logged to stdout.
```shell
npm run start-database
```

```shell
npm run grant-statistics
```

## Watch activity

```shell
npm run watch
```

## Start queries

```shell
npm run pool
```
