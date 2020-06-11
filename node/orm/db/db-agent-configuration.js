module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      database: 'cooking_db',
      user:     'postgres',
      port:      7432
     //  password: 'password'
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
