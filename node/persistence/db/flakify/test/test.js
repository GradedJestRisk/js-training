const chai = require('chai');
chai.should();
const knex = require('../database/database-client');

const logQueryAboutToBeExecuted = (knex) => {
   knex.on('query', function (data) {
      const query = `${data.sql} (${data.__knexQueryUid}`
      console.log(`About to be executed: ${query}`);
   });
}

const flakify = (knex) => {

   // https://knexjs.org/#Interfaces-Events
   knex.on('start', function (builder) {

      if (builder._method === 'select') {
         if (builder._single.table === 'foo') {
            builder._single.table = 'foo_shuffled AS foo';
         }
      }

      if (builder._statements) {

         builder._statements.map((statement) => {
            if (statement.table === 'foo') {
               statement.table = 'foo_shuffled AS foo'
            }
         })
      }


   });
}
describe('flakify', () => {

   describe('should make flaky test fail more frequently', async () => {

      // before(() => {
      //    flakify(knex);
      // })

      beforeEach(async () => {
         await knex.table('bar').delete();
         await knex.table('foo').delete();
      })

      it('on single SELECT', async () => {
         const data = [{id: 1}, {id: 2}, {id: 3}];
         await knex.table('foo').insert(data);
         const actualData = await knex.table('foo').select();

         // should always pass
         actualData.should.have.deep.members(data);

         // should fail frequently (but not every time)
         actualData.should.not.be.deep.equal(data);
      })

      it('on join SELECT, as principal', async () => {
         const fooData = [{id: 1}, {id: 2}, {id: 3}];
         const barData = [{id: 1, foo_id: fooData[1].id},
            {id: 0, foo_id: fooData[2].id}, {id: 2, foo_id: fooData[0].id}
         ];
         await knex.table('foo').insert(fooData);
         await knex.table('bar').insert(barData);

         logQueryAboutToBeExecuted(knex);
         flakify(knex);
         const actualFooData = await knex.table('foo').join('bar', 'bar.foo_id', 'foo.id').select('foo.id');

         // should always pass
         actualFooData.should.have.deep.members(fooData);

         // should fail frequently (but not every time)
         actualFooData.should.not.be.deep.equal(fooData);

      })

      it('on join SELECT, as secondary', async () => {
         const fooData = [{id: 1}, {id: 2}, {id: 3}];
         const barData = [{id: 1, foo_id: fooData[1].id},
            {id: 0, foo_id: fooData[2].id}, {id: 2, foo_id: fooData[0].id}
         ];
         await knex.table('foo').insert(fooData);
         await knex.table('bar').insert(barData);

         logQueryAboutToBeExecuted(knex);
         flakify(knex);
         const actualFooData = await knex.table('bar').join('foo', 'bar.foo_id', 'foo.id').select('foo.id');

         // should always pass
         actualFooData.should.have.deep.members(fooData);

         // should fail frequently (but not every time)
         actualFooData.should.not.be.deep.equal(fooData);

      })

   });

   describe('should not make data modification fail', async () => {

      before(() => {
         flakify(knex);
      })

      beforeEach(async () => {
         await knex.table('foo').delete();
      })

      it('INSERT', async () => {
         const data = [{id: 1}];
         await knex.table('foo').insert(data);
         const rawData = await knex.raw('SELECT * FROM foo');
         const actualData = rawData.rows;
         actualData.should.have.deep.members(data);
      })



   });

})
