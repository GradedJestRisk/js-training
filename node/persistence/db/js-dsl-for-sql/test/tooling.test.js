const knex = require('../knex/knex.js');
const chai = require('chai');
const recipeRepository = require('../src/repositories/recipe');
chai.should();

const tableName = 'recipe';

describe('tooling', async () => {

   const recipe = {
      dietType: 'vegetarian',
      name: 'caramelized-garlic-tart',
      serving: 4,
      source: 'https://www.theguardian.com/lifeandstyle/2008/mar/01/foodanddrink.shopping1'
   };

   beforeEach(async () => {
      await recipeRepository.removeAll();
   });

   describe('pools on tarn', async () => {

      it('should return metrics', async () => {

         const pool = knex.client.pool;
         // console.log('number of non-free resources: ' + pool.numUsed());
         // console.log('number of free resources: ' + pool.numFree());
         // console.log('how many acquires are waiting for a resource to be released: ' + pool.numPendingAcquires());
         // console.log('how many asynchronous create calls are running: ' + pool.numPendingCreates());

         pool.numUsed().should.equal(0);
         pool.numFree().should.equal(1);
         pool.numPendingAcquires().should.equal(0);
         pool.numPendingCreates().should.equal(0);

      })

   })

   describe('diagnostic', async () => {

      it('raw() should run plain SQL, but do not execute query', async () => {
         const currentDatabaseQuery = 'SELECT * FROM current_database()';
         const currentDatabase = (await knex.raw(currentDatabaseQuery)).rows[0].current_database;
         currentDatabase.should.eq('cooking_db');
      })

      it('toSQL() returns generated SQL, but do not execute query', async () => {
         const minServing = 4;
         const query = await knex.from(tableName).select('name', 'serving').where('serving', '>=', minServing).toSQL();
         // console.dir(query);
         query.sql.should.eq('select \"name\", \"serving\" from \"recipe\" where \"serving\" >= ?');
         query.bindings[0].should.eq(minServing);
      })

      it('toNative() returns final generated SQL and bindings, but do not execute query', async () => {
         const minServing = 4;
         const query = await knex.from(tableName).select('name', 'serving').where('serving', '>=', minServing).toSQL().toNative();
         // console.dir(query);
         query.sql.should.eq('select \"name\", \"serving\" from \"recipe\" where \"serving\" >= $1');
         query.bindings[0].should.eq(minServing);
      })

      // Commented out not to clutter test output
      // Fir get debug on each query:
      // - add in knexfile.js: "debug: true"
      // - export environment variable: DEBUG=knex.*
      //
      // it('debug(true) shows query and bindings, and execute query', async () => {
      //    await knex(tableName).insert(recipe);
      //    const query = await knex.from(tableName).select().where('serving', '>=', recipe.serving).debug(true);
      //    // console.dir(query);
      //    query[0].should.deep.equal(recipe);
      // })

   });

   // Full list http://knexjs.org/#Interfaces-Events
   describe('events', async () => {

      afterEach(()=>{
         knex.removeAllListeners('start');
         knex.removeAllListeners('query');
         knex.removeAllListeners('query-response');
      })


      it('*start* event is fired at before query is compiled', async () => {

         // A start event is fired right before a query-builder is compiled.
         // Note: While this event can be used to alter a builders state prior to compilation
         // it is not to be recommended.
         // Future goals include ways of doing this in a different manner such as hooks.

         knex.on('start', (query) => {
            // console.log(`start event on ${sqlQuery}`);
            query._single.table.should.eq(tableName);
            query._single.limit.should.eq(1);
            // if (query.sql === 'select "recipe".* from "recipe" where "id" = ? and "correlation" = ? limit ?'){
            //    const correlationId = query.bindings[1];
            //    query.sql = `/*correlation=${correlationId}*/ select "recipe".* from "recipe" where "id" = ? limit ?`;
            //    query.bindings[1] = query.bindings[2];
            //    delete query.bindings[2];
            // }
         });

         await knex.table(tableName).select().first();
      })

      it('*query* event is fired at before query is executed', async () => {

         const currentDatabaseQuery = 'SELECT * FROM current_database()';

         knex.on('query', (query) => {
            const sqlQuery = query.sql;
            // console.log(`query event on ${sqlQuery}`);
            sqlQuery.should.eq(currentDatabaseQuery);
         });

         await knex.raw(currentDatabaseQuery);
      })

      it('*query-response* event is fired at each query response', async () => {

         const expectedDatabaseName = 'cooking_db';
         const currentDatabaseQuery = 'SELECT * FROM current_database()';

         knex.on('query-response', (query) => {
            const databaseName = query.rows[0].current_database;
            // console.log(`query-response event on ${query.sql}`);
            databaseName.should.eq(expectedDatabaseName);
         });

         await knex.raw(currentDatabaseQuery);
      })
   });

});
