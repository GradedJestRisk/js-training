const knex = require('./knex');

(async () => {
    const resetSchemaQuery = 'DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;'
    await knex.raw(resetSchemaQuery);
    process.exit( 0);
})();

