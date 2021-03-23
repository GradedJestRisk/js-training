const databaseConfiguration = require('./database-configuration');

module.exports = {

   development: {
      client: 'postgresql',
      //debug: true,
      connection: {
         database: databaseConfiguration.databaseName,
         port: databaseConfiguration.serverPort,
         user: databaseConfiguration.userName,
      },
      pool: {
         min: 1,
         max: 2
      },
      migrations: {
         tableName: 'schema_migration',
         directory: './schema-migration',
      },
      seeds: {
         directory: './data-creation',
      },
      //debug: true
   }

};
