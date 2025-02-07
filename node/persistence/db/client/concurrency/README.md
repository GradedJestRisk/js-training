# Concurrency

Demonstrate how contention may occur in database client.

## Pre-requisites

### Linux / Ubuntu

Install docker.

Install [nvm](https://github.com/nvm-sh/nvm).

Install `psql`
```shell
sudo apt install postgresql-client
```

Install `pgbench`
```shell
sudo apt-get install postgresql-contrib
```

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

#### Monitor

Check:
- running queries
- executed queries
- CPU usage in container (`docker stats`)


#### Start queries

Execute the same number of queries (10):
- from one client : 1 active connexion at a time;
- from twenty clients : : 20 active connexion at a time.

```shell
npm run select-big-table-many-times-one-client
npm run select-big-table-many-times-twenty-clients
```

Check the CPU usage is a bottleneck (always `100%`).

Between execution, check the mean time and reset the statistics.
```shell
npm run reset-statistics
```

Double the amount of CPU in [](.env) file to check it.
```text
POSTGRESQL_CPU_COUNT=2
```

Restart the database
```shell
npm run start-database && npm run create-big-table
```

Run queries again.

Check the CPU usage increase above `100%`, not more than `200%`.

#### Compare results

##### One CPU

It took 200% more time to run on 20 connexions.
```text
tps = 1.082049
tps = 0.564572
```

##### Two CPU

It took less time with 2 CPU than one.

It took 75% more time to run on 20 connexions.
The delta between 1 and 20 connexion is narrowing.
```text
tps = 1.571369
tps = 1.123237
```

#### CPU usage

Change CPU by selecting more-intensive operators in [](./scripts/select-big-table.sql)

Compare results
```text
                   inlined_query                    | total_exec_time | calls | min_ms | max_ms | mean_ms  | percentage_cpu
----------------------------------------------------+-----------------+-------+--------+--------+----------+----------------
 SELECT * FROM (    SELECT MD5(id::TEXT) hash FROM  |       344421.75 |    20 |  15099 |  22418 | 17221.09 |          34.39
 SELECT id FROM big_table WHERE id=$1               |       627193.75 |    80 |    535 |  17508 |  7839.92 |          62.63
 SELECT SUM(id) FROM big_table                      |        29780.16 |    20 |   1349 |   1930 |  1489.01 |           2.97
```

#### Parallelization

If you allocate more than one CPU, you can also use parallelization.
Uncomment section "Parallelization" in [postgresql.conf](./configuration/postgresql.conf).

Restart the database
```shell
npm run start-database && npm run create-big-table
```

Run queries again.

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

## Bonus

### Execution plan

#### In CLI
```shell
npm run explain-select-big-table-by-id
```

#### In database logs

Activate [auto_explain](./configuration) - add overhead

Restart database
```shell
npm run start-database
```

Watch log
```shell
npm run database-logs
```

Run a query
```shell
npm run create-big-table
npml run select-big-table-by-id
```

### Peek into the cache

#### Monitor

Check `big_table` is not completely in the cache
```shell
npm run cache
```

#### Run query

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
