const knex = require('../knex/knex.js');
const chai = require('chai');
const recipeRepository = require('../src/repositories/recipe');
chai.should();

const tableName = 'recipe';

describe('test', async () => {

    beforeEach(async () => {
        await recipeRepository.removeAll();
    });

    it('raw should run plain SQL', async () => {
        const currentDatabaseQuery = 'SELECT * FROM current_database()';
        const currentDatabase = (await knex.raw(currentDatabaseQuery)).rows[0].current_database;
        currentDatabase.should.eq('cooking_db');
    })

    it('error in transaction should prevent data insertion', async () => {

        const recipe = {
            name: 'caramelized-garlic-tart',
            serving: 4,
            source: 'https://www.theguardian.com/lifeandstyle/2008/mar/01/foodanddrink.shopping1'
        };

        try {
            await knex.transaction(async trx => {
                await trx(tableName).insert(recipe);
                await trx('unknownTable').insert(recipe);
            })
        } catch (error) {
            //console.error("Error raised:" + error);
            const count = await recipeRepository.count();
            count.should.equal(0);
        }

    })

    it('call rollback  in transaction should prevent data insertion', async () => {

        const recipe = {
            name: 'caramelized-garlic-tart',
            serving: 4,
            source: 'https://www.theguardian.com/lifeandstyle/2008/mar/01/foodanddrink.shopping1'
        };

        try {
            await knex.transaction(async trx => {
                await trx(tableName).insert(recipe);
                await trx.rollback();
            })
        } catch (error) {
            //console.error("Error raised:" + error);
            const count = await recipeRepository.count();
            count.should.equal(0);
        }

    })


});