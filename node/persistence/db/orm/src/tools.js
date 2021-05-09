const dbAgent = require('../db/db-agent')

const testDatabaseConnection = async function () {
   const rawResult = await dbAgent.raw('SELECT current_database() AS "databaseName"');
   const databaseName = rawResult.rows[0].databaseName;
   console.log('Successfully connected to ' + databaseName);
}

module.exports = {testDatabaseConnection}
