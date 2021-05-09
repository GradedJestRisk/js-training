const environment = process.env.ENVIRONMENT || 'development'
const connectionDescription = require('./db-agent-configuration.js')[environment];
const dbAgent = require('knex')(connectionDescription);

// Log SQL queries
// From https://github.com/bookshelf/bookshelf/issues/1319#issuecomment-247261588
const knexClient = require('knex/lib/client');
const origQuery = knexClient.prototype.query;
knexClient.prototype.query = function (connection, obj) {
   console.log(`DEBUG:  Method ${obj.method} Text ${obj.sql} Binding ${obj.bindings}`);
   return origQuery.apply(this, arguments);
};

module.exports = dbAgent;
