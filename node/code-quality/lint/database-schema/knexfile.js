module.exports = {
   client: 'postgresql',
   connection: 'postgresql://postgres@localhost:5432/database',
   migrations: {
      tableName: 'knex_migrations',
      directory: './migrations',
   },
};
