const knex = require('../knex/knex.js');
const chai = require('chai');
const recipeRepository = require('../src/repositories/recipe');
chai.should();

const tableName = 'recipe';

describe('knex', async () => {

   const recipe = {
      dietType: 'vegetarian',
      name: 'caramelized-garlic-tart',
      serving: 4,
      source: 'https://www.theguardian.com/lifeandstyle/2008/mar/01/foodanddrink.shopping1'
   };

   beforeEach(async () => {
      await recipeRepository.removeAll();
   });

   describe('raw', async () => {

      it('should execute SQL', async () => {
         const result = await knex.raw('SELECT current_database()');
         result.rows[0].current_database.should.equal('cooking_db');
      })

      it('should use anonymous parameter (?)', async () => {
         await knex(tableName).insert(recipe);
         const result = await knex.raw('SELECT COUNT(1) FROM recipe WHERE name = ?', recipe.name);
         result.rows[0].count.should.equal('1');
      })

      it('should use anonymous parameter (?) in nested queries', async () => {
         await knex(tableName).insert(recipe);
         const result = await knex.select('name').from('recipe').whereRaw('name = ?', recipe.name);
         result[0].name.should.equal(recipe.name);
      })

      it('should use anonymous parameters in values (??)', async () => {
         await knex(tableName).insert(recipe);
         const result = await knex.raw('SELECT COUNT(1) FROM recipe WHERE name = ? AND serving = ??', [recipe.name, recipe.serving]);
         result.rows[0].count.should.equal('1');
      })

      it('should use named parameters in values (:)', async () => {
         await knex(tableName).insert(recipe);
         const result = await knex.raw('SELECT COUNT(1) FROM recipe WHERE name = :name AND serving = :serving', {
            name: recipe.name,
            serving: recipe.serving
         });
         result.rows[0].count.should.equal('1');
      })

      it('should use named parameters in values (:) in nested queries', async () => {
         await knex(tableName).insert(recipe);
         const result = await knex.select('name').from('recipe').whereRaw('name = :name', { name:recipe.name});
         result[0].name.should.equal(recipe.name);
      })

      it('should use named parameter in name (::)', async () => {
         await knex(tableName).insert(recipe);
         const result = await knex.raw('SELECT COUNT(1) FROM :table: ', { table: 'recipe'});
         result.rows[0].count.should.equal('1');
      })

      it('should update JSONB column (??)', async () => {
         await knex.raw('DROP TABLE IF EXISTS foo');
         await knex.raw('CREATE TABLE foo (bar JSONB)');
         await knex.raw(`INSERT INTO foo (bar) VALUES ('{ "foz": "old"}')`);
         const value = 'new';

         // const escapedValue = '"new"';
         // const escapedValue = `"${value}"`;
         // const result = await knex.raw(`UPDATE foo SET bar = jsonb_set("bar", '{foz}', ?) RETURNING bar`, escapedValue);

         const result = await knex.raw(`UPDATE foo SET bar = jsonb_set("bar", '{foz}', ?) RETURNING bar`, `"${value}"`);

         result.rows[0].bar.foz.should.equal('new');
      })

   })


   describe('pools on tarn', async () => {
      it('should return metrics', async () => {

         const pool = knex.client.pool;
         console.log('number of non-free resources: ' + pool.numUsed());
         console.log('number of free resources: ' + pool.numFree());
         console.log('how many acquires are waiting for a resource to be released: ' + pool.numPendingAcquires());
         console.log('how many asynchronous create calls are running: ' + pool.numPendingCreates());

      })
   })

   describe('select', async () => {
      it('should select all columns', async () => {
         await knex(tableName).insert(recipe);
         const recipes = await knex.from(tableName).select();
         recipes[0].should.deep.equal(recipe);
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

      it('debug(true) shows query and bindings, and execute query', async () => {
         await knex(tableName).insert(recipe);
         const query = await knex.from(tableName).select().where('serving', '>=', recipe.serving).debug(true);
         // console.dir(query);
         query[0].should.deep.equal(recipe);

      })

   });

   describe('transaction', async () => {

      it('error in transaction should prevent data insertion', async () => {

         try {
            await knex.transaction(async trx => {
               await trx(tableName).insert(recipe);
               await trx('unknownTable').insert(recipe);
            })
         } catch (error) {
            //console.error("Error raised:" + error);
         }

         const count = await recipeRepository.count();
         count.should.equal(0);
      })

      it('call rollback in transaction should prevent data insertion', async () => {

         try {
            await knex.transaction(async trx => {
               await trx(tableName).insert(recipe);
               await trx.rollback();
            })
         } catch (error) {
            console.error("Error raised:" + error);
         }

         const count = await recipeRepository.count();
         count.should.equal(0);

      })

      it('call rollback in transaction does not affect other transaction', async () => {

         try {
            await knex.transaction(async trx => {
               await recipeRepository.create(recipe);
               await trx(tableName).insert(recipe);
               await trx.rollback();
            })
         } catch (error) {
            //console.error("Error raised:" + error);
         }

         const count = await recipeRepository.count();
         count.should.equal(1);

      })

      it('is more slowly than without transaction ', async () => {

         const insert = async function () {
            return knex(tableName).insert(recipe);
         }

         const insertTransaction = async function () {
            await knex.transaction(async trx => {
               await trx(tableName).insert(recipe);
            })
         }
         const MAX_ITERATIONS = 200;
         let currentIterationCount;

         const begin = Date.now();
         currentIterationCount = 0;
         while (currentIterationCount++ <= MAX_ITERATIONS) {
            await insert();
         }
         const duration = Date.now() - begin;

         const beginTransaction = Date.now();
         currentIterationCount = 0;
         while (currentIterationCount++ <= MAX_ITERATIONS) {
            await insertTransaction();
         }
         const durationTransaction = Date.now() - beginTransaction;

         console.log('With transaction  (ms): ' + durationTransaction);
         console.log('Without transaction (ms): ' + duration);
         durationTransaction.should.be.greaterThan(duration);
      })

      describe('transaction can return a value', async () => {

         it('when transaction succeed', async () => {

            const RETURN_CODE = 1;


            let actualCode;
            try {
               actualCode = await knex.transaction(async trx => {
                  await trx(tableName).insert(recipe);
                  return RETURN_CODE;
               })
            } catch (error) {
               console.error("Error raised in transaction:" + error);
            }

            actualCode.should.equal(RETURN_CODE);

         })

         it('when transaction fails', async () => {

            const RETURN_CODE = 1;

            let actualCode;
            try {
               actualCode = await knex.transaction(async trx => {
                  await trx.rollback();
               })
            } catch (error) {
               console.error("Error raised in transaction:" + error);
               return RETURN_CODE;
            }

            actualCode.should.equal(RETURN_CODE);

         });

      });

   });
});
