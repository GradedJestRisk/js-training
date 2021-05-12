require('dotenv').config();
const knex = require('knex');

const knexConfigured = knex({
   client: 'pg',
   connection: {
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      user: process.env.DATABASE_USERNAME,
      database: process.env.DATABASE_INSTANCE_NAME
   }
});

module.exports = knexConfigured
