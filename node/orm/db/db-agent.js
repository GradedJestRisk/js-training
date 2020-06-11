const environment = process.env.ENVIRONMENT || 'development'
const connectionDescription = require('./db-agent-configuration.js')[environment];
const dbAgent = require('knex')(connectionDescription);

module.exports = dbAgent;