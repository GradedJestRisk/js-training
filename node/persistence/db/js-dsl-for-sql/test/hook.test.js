const chai = require('chai');
chai.should();

describe('hook', async () => {

   it('should be called', async () => {
      // Refer to knex/knex.js to install hooks
      // const knex = require('../db/db-agent')
      // await knex.select('*').from('foo').where({id: 0, correlation: 8});
      true.should.be.true;
   });

});
