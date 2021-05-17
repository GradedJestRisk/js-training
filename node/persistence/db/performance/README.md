# Performance

## TL;DR
A proof-of-concept that API performance test can be done on both:
- http request performance;
- database request performance.

Correlation is achieved by rewriting queries using knex library.
The solution works on limited knex query set (raw and `SELECT`),
but full query coverage, including Bookshelf ORM, can be achieved.

## Goal
Performance test are done in both sides:
- from client side (eg. in a performance test like Artillery);
- from database side (eg. using PostgreSQL native logs).

Correlation between http request and SQL query has to be done manually.

The aim is to track a user activity all the way.

Given an end-user (identified by a unique token):
- how many requests did he make ?
- how much time did they last ?
- how many database queries have been triggered, how long where they ?

Furthermore, we need global statistics:
- most running queries, shortest and longest;
- most called routes, shortest and longest;
- ability to partition by application version.

## Implementation

### Persistence
To make data manipulation easiest, all monitoring is stored in a database.
To ensure the logging itself does not affect the main database, it is logged
in a separate instance. Aggregated statistics are available through views.

### Timing queries
Knex emits events upon query creation and completion, which make query
timing easy, see [this tutorial](https://spin.atomicobject.com/2017/03/27/timing-queries-knexjs-nodejs/).

### Correlation http requests with queries
When some route handler issue a query with knex, knex has no idea which handler called him.
Google's [commenter](https://github.com/google/sqlcommenter/blob/master/nodejs/sqlcommenter-nodejs/)
hinted me to wrap trace data (here, http request) in SQL comment, which are not interpreted.

Knex does not yet offer [comments on any query](https://github.com/knex/knex/pull/2815),
but he supports [hints comments](http://knexjs.org/#Builder-hintComment) on a set.

### Logging request-specific data
Hapi provides hooks, which has been used to log requests:
- when a request has been received;
- before the response is sent.

The routing table is logged on startup, to provide an aggregated view on all requests.

The application version is read from `package.json` and logged in each request.

Each user is identified by a custom `X-CorrelationId` header logged with each request.

### Overview
![overview](./documentation/overview.png)
