const knexMonitoring = require('knex')({
   client: 'pg',
   connection: {
      host: process.env.MONITORING_DATABASE_HOST,
      port: process.env.MONITORING_DATABASE_PORT,
      user: process.env.MONITORING_DATABASE_USERNAME,
      database: process.env.MONITORING_DATABASE_INSTANCE_NAME
   }
});

const knexMonitored = require('knex')({
   client: 'pg',
   connection: {
      host: process.env.MONITORED_DATABASE_HOST,
      port: process.env.MONITORED_DATABASE_PORT,
      user: process.env.MONITORED_DATABASE_USERNAME,
      database: process.env.MONITORED_DATABASE_INSTANCE_NAME
   }
});

const initializePerformanceTrace = async (knex) => {

   await knex.raw(`DROP TABLE IF EXISTS query`);

   await knex.raw(`DROP TABLE IF EXISTS query_execution`);

   await knex.raw(`CREATE TABLE query (
        id TEXT NOT NULL PRIMARY KEY,
        type TEXT,
        text TEXT
    )`);

   await knex.raw(`CREATE TABLE query_execution (
        id TEXT NOT NULL,
        start_date BIGINT,
        duration BIGINT,
        PRIMARY KEY(id, start_date)
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
