const knex = require('../db/db-agent.js');
const chai = require('chai');
const recipeRepository = require('../src/repositories/db');
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
    });

    describe('diagnostic', async () => {

        it('raw() should run plain SQL', async () => {
            const currentDatabaseQuery = 'SELECT * FROM current_database()';
            const currentDatabase = (await knex.raw(currentDatabaseQuery)).rows[0].current_database;
            currentDatabase.should.eq('cooking_db');
        })

        it('toSQL() show generated SQL', async () => {
            const minServing = 4;
            const query = await knex.from(tableName).select('name', 'serving').where('serving', '>=', minServing).toSQL();
            // console.dir(query);
            query.sql.should.eq('select \"name\", \"serving\" from \"recipe\" where \"serving\" >= ?');
            query.bindings[0].should.eq(minServing);
        })

        it('toNative() show final generated SQL', async () => {
            const minServing = 4;
            const query = await knex.from(tableName).select('name', 'serving').where('serving', '>=', minServing).toSQL().toNative();
            // console.dir(query);
            query.sql.should.eq('select \"name\", \"serving\" from \"recipe\" where \"serving\" >= $1');
            query.bindings[0].should.eq(minServing);
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