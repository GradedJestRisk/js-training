const knex = require('../knex/knex.js');
const chai = require('chai');
chai.should();

describe('test', async () => {

    it('raw should run plain SQL', async ()=> {
        const currentDatabaseQuery = 'SELECT * FROM current_database()';
        const currentDatabase = (await knex.raw(currentDatabaseQuery)).rows[0].current_database;
        currentDatabase.should.eq('cooking_db');
    })
});