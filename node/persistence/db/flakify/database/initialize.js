const knex = require('./database-client');

const initializeDummySchema = async (knex) => {

   await knex.raw(`DROP TABLE IF EXISTS bar`);
   await knex.raw(`DROP VIEW IF EXISTS foo_shuffled`);
   await knex.raw(`DROP TABLE IF EXISTS foo`);

   await knex.raw(`CREATE TABLE foo (
        id INTEGER PRIMARY KEY
    )`);

   await knex.raw(`CREATE TABLE bar (
        id INTEGER PRIMARY KEY,
        foo_id INTEGER REFERENCES foo(id)
    )`);

   await knex.raw(`CREATE VIEW foo_shuffled AS
                   SELECT * FROM foo ORDER BY RANDOM()`);

}

(async () => {
   await initializeDummySchema(knex);
   process.exit();
})();
