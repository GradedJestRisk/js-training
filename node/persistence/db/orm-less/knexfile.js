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
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './knex/migrations',
    },
    seeds: {
      directory: './knex/seeds',
    },
  }

};
