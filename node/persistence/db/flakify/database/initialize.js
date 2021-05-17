const knex = require('./database-client');

const initializeDummySchema = async (knex) => {

   await knex.raw(`DROP TABLE IF EXISTS foobar`);
   await knex.raw(`DROP TABLE IF EXISTS bar`);
   await knex.raw(`DROP VIEW IF EXISTS foo_shuffled`);
   await knex.raw(`DROP TABLE IF EXISTS foo`);

   await knex.raw(`CREATE TABLE foobar (
        id INTEGER PRIMARY KEY
    )`);

   await knex.raw(`CREATE TABLE foo (
        id INTEGER PRIMARY KEY,
        created_at DATE DEFAULT NOW()
    )`);

   await knex.raw(`CREATE TABLE bar (
        id INTEGER PRIMARY KEY,
        foo_id INTEGER REFERENCES foo(id)
    )`);

   await knex.raw(`CREATE VIEW foo_shuffled AS
                   SELECT * FROM foo ORDER BY RANDOM()`);

   await knex.raw(`CREATE VIEW foobar_shuffled AS
                   SELECT * FROM foobar ORDER BY RANDOM()`);

}

(async () => {
   await initializeDummySchema(knex);
   process.exit();
})();
