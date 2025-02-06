# Concurrency

Demonstrate how contention may occur in database client.

## Start container

In [.env](.env), locate `POSTGRESQL_MAX_CONNECTIONS`.
Set it to the maximum number of connections you want your database to accept at the same time.

As 3 connexions are reserved for the superuser, add 3.

E.g., to get 2 connexions, set it to 5 ( 3 superuser  + 2 applicative).
```text
POSTGRESQL_MAX_CONNECTIONS=5
```

Then start the container
```shell
npm run start-database
```

## Benchmark using no data

### Monitor

Each in one terminal
```shell
npm run database-log
npm run running-queries
```


### Start queries

#### Serialization

Execute queries, with one connexion in the pool
```shell
npm run pool:one
```

Check they're executed the one after the other.

#### Parallelization

Execute queries, with two connexion in the pool
```shell
npm run pool:one
```

Check they're executed in parallel, two of them.

## Benchmark using data

### Monitor

Each in one terminal
```shell
npm run running-queries
npm run executed-queries
```

### Create dataset

Add some data to query the database against (2 minutes, 3 GB, 100 millions records).
```shell
npm run create-big-table
```

Check:
- running queries
- executed queries


## Locks

### Monitor

```shell
npm run lock
```

### Create a lock

In a terminal
```shell
npm run console
SET application_name = 'batch-queries-postgresql';
BEGIN; LOCK TABLE big_table IN EXCLUSIVE MODE;
```

In another terminal
```shell
npm run console
UPDATE big_table SET id = id + 1;
```

Check the lock appears.

### Terminate a session

Locate the PID of the locking session :
- in locks;
- or running queries.

In a terminal, open a console
```shell
npm run console
```

Cancel the query blocking the other one.
```postgresql
SELECT pg_cancel_backend(13666);
```

Close forcefully the connexion
```postgresql
SELECT pg_terminate_backend(13666);
```

## Cache

### Monitor

Check `big_table` is not completely in the cache
```shell
npm run cache
```

### Run query

Check, by running the query again and again, that execution time stays the same (a few seconds)
```shell
npm run select-sum-big-table
```

Check, by running the query again and again, that execution time:
- is long the first time the same (a few seconds);
- is quick afterward (a few milliseconds).

If not, why ?
```shell
npm run select-big-table-by-id
```
