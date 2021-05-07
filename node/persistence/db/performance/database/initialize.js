const {knexMonitoring, knexMonitored} = require('./database-client');

const initializePerformanceTrace = async (knex) => {

   await knex.raw(`DROP VIEW IF EXISTS query_statistics`);
   await knex.raw(`DROP TABLE IF EXISTS query_execution`);
   await knex.raw(`DROP TABLE IF EXISTS correlation`);
   await knex.raw(`DROP TABLE IF EXISTS query`);

   await knex.raw(`CREATE TABLE correlation (
        id TEXT NOT NULL PRIMARY KEY,
        text TEXT NOT NULL
    )`);

   await knex.raw(`CREATE TABLE query (
        id TEXT NOT NULL PRIMARY KEY,
        type TEXT NOT NULL,
        text TEXT NOT NULL
    )`);

   await knex.raw(`CREATE TABLE query_execution (
        id TEXT PRIMARY KEY,
        query_id TEXT NOT NULL REFERENCES query (id),
        correlation_id TEXT NOT NULL REFERENCES correlation (id),
        start_date BIGINT NOT NULL,
        duration BIGINT NOT NULL
    )`);

   await knex.raw(`CREATE VIEW query_statistics AS (
                  SELECT
                     SUBSTRING(q.text FROM 1 FOR 50) QUERY_SOURCE,
                     COUNT(1)                        COUNT,
                     TO_CHAR(TIMESTAMP 'epoch' + MIN(start_date) * INTERVAL '1 millisecond', 'HH:MI:SS')      FIRST_EXECUTED,
                     TO_CHAR(TIMESTAMP 'epoch' + MAX(start_date) * INTERVAL '1 millisecond', 'HH:MI:SS')      LAST_EXECUTED,
                     MIN(qe.duration)                MIN_DURATION_MS,
                     MAX(qe.duration)                MAX_DURATION_MS,
                     TRUNC(AVG(qe.duration))         AVERAGE_DURATION_MS,
                     TRUNC(STDDEV_POP(qe.duration))  STANDARD_DEVIATION_MS
                  FROM query q
                     INNER JOIN query_execution qe ON qe.query_id = q.id
                  WHERE 1=1
                  GROUP BY q.text
                  ORDER BY
                     q.text ASC)`);

}

const initializeDummySchema = async (knex) => {

   await knex.raw(`DROP TABLE IF EXISTS foo`);

   await knex.raw(`CREATE TABLE foo (
        id INTEGER
    )`);

}

(async () => {
   await initializePerformanceTrace(knexMonitoring);
   await initializeDummySchema(knexMonitored)
   process.exit();
})();
