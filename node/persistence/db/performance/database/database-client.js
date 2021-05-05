const knex = require('knex');

const knexMonitoring = knex({
   client: 'pg',
   connection: {
      host: process.env.MONITORING_DATABASE_HOST,
      port: process.env.MONITORING_DATABASE_PORT,
      user: process.env.MONITORING_DATABASE_USERNAME,
      database: process.env.MONITORING_DATABASE_INSTANCE_NAME
   }
});

const knexMonitored = knex({
   client: 'pg',
   connection: {
      host: process.env.MONITORED_DATABASE_HOST,
      port: process.env.MONITORED_DATABASE_PORT,
      user: process.env.MONITORED_DATABASE_USERNAME,
      database: process.env.MONITORED_DATABASE_INSTANCE_NAME
   }
});

module.exports = {knexMonitoring, knexMonitored}
