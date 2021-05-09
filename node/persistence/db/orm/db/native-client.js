const databaseConfiguration = require('./database-configuration');
const {Client} = require('pg');

const client = new Client({
   database: databaseConfiguration.databaseName,
   port: databaseConfiguration.serverPort,
   user: databaseConfiguration.userName
});

client.connect();

module.exports = client;
