const {knexMonitoring, knexMonitored} = require('./database-client');

const initializePerformanceTrace = async (knex) => {

   await knex.raw(`DROP VIEW IF EXISTS query_statistics`);
   await knex.raw(`DROP VIEW IF EXISTS query_version_statistics`);
   await knex.raw(`DROP VIEW IF EXISTS route_version_statistics`);

   await knex.raw(`DROP TABLE IF EXISTS query_execution`);
   await knex.raw(`DROP TABLE IF EXISTS query`);
   await knex.raw(`DROP TABLE IF EXISTS request`);
   await knex.raw(`DROP TABLE IF EXISTS version`);
   await knex.raw(`DROP TABLE IF EXISTS correlation`);
   await knex.raw(`DROP TABLE IF EXISTS route`);

   await knex.raw(`CREATE TABLE version (
        id TEXT NOT NULL PRIMARY KEY
    )`);

   await knex.raw(`CREATE TABLE route (
        id TEXT NOT NULL PRIMARY KEY,
        text TEXT NOT NULL
    )`);

   await knex.raw(`CREATE TABLE correlation (
        id TEXT NOT NULL PRIMARY KEY,
        text TEXT NOT NULL
    )`);

   await knex.raw(`CREATE TABLE request (
        id TEXT NOT NULL PRIMARY KEY,
        route_id TEXT NOT NULL REFERENCES route (id),
        correlation_id TEXT NOT NULL REFERENCES correlation (id),
        version_id TEXT NOT NULL REFERENCES version (id),
        started_at TIMESTAMP NOT NULL DEFAULT NOW(),
        ended_at TIMESTAMP
    )`);

   await knex.raw(`CREATE TABLE query (
        id TEXT NOT NULL PRIMARY KEY,
        type TEXT NOT NULL,
        text TEXT NOT NULL
    )`);

   await knex.raw(`CREATE TABLE query_execution (
        id TEXT PRIMARY KEY,
        query_id TEXT NOT NULL REFERENCES query(id),
        request_id TEXT NOT NULL REFERENCES request(id),
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

   await knex.raw(`CREATE VIEW query_version_statistics AS (
                     SELECT
                            q.text                  QUERY_SOURCE,
                            v.id version_no,
                            COUNT(1)                COUNT,
                            TO_CHAR(TIMESTAMP 'epoch' + MIN(start_date) * INTERVAL '1 millisecond', 'HH:MI:SS')      FIRST_EXECUTED,
                            TO_CHAR(TIMESTAMP 'epoch' + MAX(start_date) * INTERVAL '1 millisecond', 'HH:MI:SS')      LAST_EXECUTED,
                            MIN(qe.duration)        MIN_DURATION,
                            MAX(qe.duration)        MAX_DURATION,
                            TRUNC(AVG(qe.duration))        AVERAGE_DURATION,
                            TRUNC(STDDEV_POP(qe.duration)) STANDARD_DEVIATION
                     FROM query q
                         INNER JOIN query_execution qe ON qe.query_id = q.id
                         INNER JOIN request r on qe.request_id = r.id
                         INNER JOIN version v on r.version_id = v.id
                     WHERE 1=1
                     GROUP BY
                         q.text,
                         v.id
                     ORDER BY
                         q.text ASC)`);

   await knex.raw(`CREATE VIEW route_version_statistics AS (
              SELECT
               rt.text route,
               v.id version_no,
               MIN(rq_dr.duration_millis),
               MAX(rq_dr.duration_millis),
               TRUNC(AVG(rq_dr.duration_millis)) average
            FROM
               (SELECT rq.id, rq.version_id, rq.route_id,
                       TRUNC((extract('epoch' from rq.ended_at) - extract('epoch' from rq.started_at)) * 1000 ) duration_millis
                FROM request rq) rq_dr
                   INNER JOIN version v ON v.id = rq_dr.version_id
                   INNER JOIN route rt ON rt.id = rq_dr.route_id
            GROUP BY
               rt.text, v.id
            ORDER BY
                rt.text ASC
            )`);

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
