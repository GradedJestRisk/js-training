# Concurrency

Demonstrate how contention may occur in database client.

Pre-requisites:
- nvm
- psql, pgbench

## Setup

Install the libraries.
```shell
nvm use .
npm install
```

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

## Test maximum connection

### As superuser

Try connecting as many times as possible in superuser in separate terminals (5 times)
```shell
npm run console:superuser
```

You'll get the message as you reach `POSTGRESQL_MAX_CONNECTIONS`
```text
sorry, too many clients already
```

Disconnect in one terminal and try connecting as a user
```shell
npm run console
```

You''l get
```text
FATAL:  remaining connection slots are reserved for roles with the SUPERUSER attribute
```

You'll have to disconnect until you get only 2 superuser connected.
Then you will be able to connect.

Executing this query, you'll see that superuser connect to a different database.
```shell
npm run list-connexions
```
So the connexions count in `POSTGRESQL_MAX_CONNECTIONS` is for all databases.


### As user

Disconnect everyone
```shell
npm run terminate-all-connexions
```


## Benchmark from terminal

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

### Query concurrently

Execute in 2 connexions, 10 transactions per connexion (total 20)
```shell
npm run select-big-table-many-times
```

Check:
- running queries
- executed queries

Reset the statistics
```shell
npm run reset-statistics
```


## Benchmark from application

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


## Identify locks

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

## Peek into the cache

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
