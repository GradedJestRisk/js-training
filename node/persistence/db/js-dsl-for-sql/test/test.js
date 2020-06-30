const knex = require('../knex/knex.js');
const chai = require('chai');
const recipeRepository = require('../src/repositories/recipe');
chai.should();

const tableName = 'recipe';

describe('knex', async () => {

    const recipe = {
        name: 'caramelized-garlic-tart',
        serving: 4,
        source: 'https://www.theguardian.com/lifeandstyle/2008/mar/01/foodanddrink.shopping1'
    };

    beforeEach(async () => {
        await recipeRepository.removeAll();
        await knex(tableName).insert(recipe);
    });

    describe('pools on tarn', async ()=>{
        it('should return metrics', async ()=>{

            const pool = knex.client.pool;
            console.log('number of non-free resources: ' + pool.numUsed());
            console.log('number of free resources: ' + pool.numFree());
            console.log('how many acquires are waiting for a resource to be released: ' + pool.numPendingAcquires());
            console.log('how many asynchronous create calls are running: ' + pool.numPendingCreates());

        })
    })

    describe('select', async ()=>{
        it('should select all columns', async ()=>{
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
            const minServing = 4;
            const query = await knex.from(tableName).select().where('serving', '>=', minServing).debug(true);
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
                //console.error("Error raised:" + error);
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