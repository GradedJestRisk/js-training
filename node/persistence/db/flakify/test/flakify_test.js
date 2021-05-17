const chai = require('chai');
chai.should();
const knex = require('../database/database-client');
const {flakify} = require('../code/flakify');

// debug purpose
// const {logQueryAboutToBeExecuted} = require('./helper');
// logQueryAboutToBeExecuted(knex);

describe('flakify', () => {

   describe('should make select queries use shuffled view on selected table', async () => {

      before(() => {
         flakify(knex);
      })

      beforeEach(async () => {
         await knex.table('bar').delete();
         await knex.table('foo').delete();
         await knex.table('foobar').delete();
      })

      describe('in knex DSL syntax',()=>{

      it('on single SELECT', async () => {

         // given
         const data = [{id: 1}, {id: 2}, {id: 3}];
         await knex.table('foo').insert(data);

         // when
         const expectedQuery = 'select "id" from "foo_shuffled" as "foo"';
         let actualQuery;
         await knex.table('foo').select('id').on('query', function (data) {
            actualQuery = data.sql;
         });

         // then
         actualQuery.should.equal(expectedQuery);

         // when

         // For debug
         // flakify(knex);
         const actualData = await knex.table('foo').select('id');

         // then
         // should always pass
         actualData.should.have.deep.members(data);

         // should fail frequently (but not every time)
         //actualData.should.be.deep.equal(data);
      })

      it('on another selected table', async () => {

         // given
         const data = [{id: 1}, {id: 2}, {id: 3}];
         await knex.table('foobar').insert(data);

         // when
         const expectedQuery = 'select "id" from "foobar_shuffled" as "foobar"';
         let actualQuery;
         await knex.table('foobar').select('id').on('query', function (data) {
            actualQuery = data.sql;
         });

         // then
         actualQuery.should.equal(expectedQuery);

         // when

         // For debug
         // flakify(knex);
         const actualData = await knex.table('foobar').select('id');

         // then
         // should always pass
         actualData.should.have.deep.members(data);

         // should fail frequently (but not every time)
         //actualData.should.be.deep.equal(data);
      })

      it('on single aliased SELECT', async () => {
         const data = [{id: 1}, {id: 2}, {id: 3}];
         await knex.table('foo').insert(data);

         // then
         const expectedQuery = 'select "id" from "foo_shuffled" as "bar"';
         let actualQuery;
         await knex.select('id').from({bar: 'foo'}).on('query', function (data) {
            actualQuery = data.sql;
         });
         actualQuery.should.equal(expectedQuery);


         const actualData = await knex.select('id').from({bar: 'foo'});

         // should always pass
         actualData.should.have.deep.members(data);

         // should fail frequently (but not every time)
         //actualData.should.be.deep.equal(data);
      })

      it('on sub-query', async () => {
         const fooData = [{id: 1}, {id: 2}, {id: 3}];
         const barData = [
            {id: 0, foo_id: fooData[0].id},
            {id: 1, foo_id: fooData[1].id},
            {id: 2, foo_id: fooData[2].id}
         ];
         await knex.table('foo').insert(fooData);
         await knex.table('bar').insert(barData);

         // then
         const expectedQuery = 'select "foo_id" as "id" from "bar" where "foo_id" >= (select min("id") from "foo_shuffled" as "foo")';
         let actualQuery;
         await knex.table('bar').select('foo_id AS id').where('foo_id', '>=', knex.table('foo').min('id')).on('query', function (data) {
            actualQuery = data.sql;
         });
         actualQuery.should.equal(expectedQuery);

         const actualData = await knex.table('bar').select('foo_id AS id').where('foo_id', '>=', knex.table('foo').min('id'));

         // should always pass
         actualData.should.have.deep.members(fooData);

         // should fail frequently (but not every time)
         //actualData.should.be.deep.equal(fooData);
      })

      it('on join SELECT, as principal', async () => {
         const fooData = [{id: 1}, {id: 2}, {id: 3}];
         const barData = [{id: 1, foo_id: fooData[1].id},
            {id: 0, foo_id: fooData[2].id}, {id: 2, foo_id: fooData[0].id}
         ];
         await knex.table('foo').insert(fooData);
         await knex.table('bar').insert(barData);

         // when
         let actualQuery;
         await knex.table('foo').join('bar', 'bar.foo_id', 'foo.id').select('foo.id').on('query', function (data) {
            actualQuery = data.sql;
         });

         // then
         const expectedQuery = 'select "foo"."id" from "foo_shuffled" as "foo" inner join "bar" on "bar"."foo_id" = "foo"."id"';
         actualQuery.should.equal(expectedQuery);

         // when
         const actualFooData = await knex.table('foo').join('bar', 'bar.foo_id', 'foo.id').select('foo.id');

         // then
         // should always pass
         actualFooData.should.have.deep.members(fooData);

         // should fail frequently (but not every time)
         //actualFooData.should.be.deep.equal(fooData);

      })

      it('on join SELECT, as secondary', async () => {
         const fooData = [{id: 1}, {id: 2}, {id: 3}];
         // change fooData[0].id to non-ascending order make it fail
         const barData = [
            {id: 0, foo_id: fooData[0].id},
            {id: 1, foo_id: fooData[1].id},
            {id: 2, foo_id: fooData[2].id}
         ];
         await knex.table('foo').insert(fooData);
         await knex.table('bar').insert(barData);

         // when
         let actualQuery;
         await knex.table('bar').join('foo', 'bar.foo_id', 'foo.id').select('foo.id').on('query', function (data) {
            actualQuery = data.sql;
         });

         // then
         const expectedQuery = 'select "foo"."id" from "bar" inner join "foo_shuffled" as "foo" on "bar"."foo_id" = "foo"."id"';
         actualQuery.should.equal(expectedQuery);

         // when
         const actualFooData = await knex.table('bar').join('foo', 'bar.foo_id', 'foo.id').select('foo.id');

         // then
         // should always pass
         actualFooData.should.have.deep.members(fooData);

         // should fail frequently (but not every time)
         // actualFooData.should.be.deep.equal(fooData);

      })
      })

      describe('in SQL queries made by knex.raw()', async () => {

         it('on single SELECT', async () => {
            const data = [{id: 1}];

            // when
            let actualQuery;
            await knex.raw('SELECT id FROM foo').on('query', function (data) {
               actualQuery = data.sql;
            });

            // then
            const expectedQuery = 'SELECT "id" FROM "foo_shuffled"';
            actualQuery.should.equal(expectedQuery);

            // await knex.table('foo').insert(data);
            //
            // const rawData = await knex.raw('SELECT id FROM foo');
            // const actualData = rawData.rows;
            // actualData.should.have.deep.members(data);
         })

         it('on single aliased SELECT', async () => {
            const data = [{id: 1}, {id: 2}, {id: 3}];
            await knex.table('foo').insert(data);

            const expectedQuery = 'SELECT "id" FROM "foo_shuffled" AS "bar"';
            let actualQuery;

            // when
            await knex.raw('SELECT id from foo AS bar').on('query', function (data) {
               actualQuery = data.sql;
            });
            // then
            actualQuery.should.equal(expectedQuery);

            // when
            await knex.raw('SELECT id from foo bar').on('query', function (data) {
               actualQuery = data.sql;
            });
            // then
            actualQuery.should.equal(expectedQuery);


            const actualData = await knex.select('id').from({bar: 'foo'});

            // should always pass
            actualData.should.have.deep.members(data);

            // should fail frequently (but not every time)
            //actualData.should.be.deep.equal(data);
         })

      });

   });

   describe('should not alter other queries ', async () => {

      describe('data modification queries (or they would fail, as a view cannot be changed)', async () => {

         before(() => {
            flakify(knex);
         })

         beforeEach(async () => {
            await knex.table('bar').delete();
            await knex.table('foo').delete();
         })

         it('INSERT', async () => {
            const data = [{id: 1}];

            // when
            let actualQuery;
            await knex.table('foo').insert(data).on('query', function (data) {
               actualQuery = data.sql;
            });

            // then
            const expectedQuery = 'insert into "foo" ("id") values (?)';
            actualQuery.should.equal(expectedQuery);

            // when
            // await knex.table('foo').insert(data);
            //
            // const rawData = await knex.raw('SELECT id FROM foo');
            // const actualData = rawData.rows;
            // actualData.should.have.deep.members(data);
         })

         it('UPDATE', async () => {

            const data = [{id: 1}];
            await knex.table('foo').insert(data);
            const newValue = null;

            // when
            let actualQuery;
            await knex.table('foo').update({created_at: newValue}).on('query', function (data) {
               actualQuery = data.sql;
            });

            // then
            const expectedQuery = 'update "foo" set "created_at" = ?';
            actualQuery.should.equal(expectedQuery);

//          await knex.table('foo').update({created_at: newValue});
            // const expectedData = [{"created_at": newValue}];
            // const rawData = await knex.raw('SELECT DISTINCT created_at FROM foo');
            // const actualData = rawData.rows;
            // actualData.should.have.deep.members(expectedData);
         })

         it('DELETE', async () => {

            const data = [{id: 1}];
            await knex.table('foo').insert(data);


            // when
            let actualQuery;
            await knex.table('foo').delete().on('query', function (data) {
               actualQuery = data.sql;
            });

            // then
            const expectedQuery = 'delete from "foo"';
            actualQuery.should.equal(expectedQuery);

            // await knex.table('foo').delete();
            //
            // const rawData = await knex.raw('SELECT * FROM foo');
            // const actualData = rawData.rows;
            // actualData.should.have.deep.members([]);
         })

      });

      describe('when a selected table name appears as an alias of another query', async () => {

         before(() => {
            // flakify(knex);
         })

         beforeEach(async () => {
            await knex.table('bar').delete();
            await knex.table('foo').delete();
         })

         it('using sql aliases (AS)', async () => {
            const fooData = [{id: 1}, {id: 2}, {id: 3}];
            // change fooData[0].id to non-ascending order make it fail
            const barData = [
               {id: 0, foo_id: fooData[0].id},
               {id: 1, foo_id: fooData[1].id},
               {id: 2, foo_id: fooData[2].id}
            ];
            await knex.table('foo').insert(fooData);
            await knex.table('bar').insert(barData);

            // when
            let actualQuery;
            await knex.table('bar AS FOO').select('foo_id AS id').on('query', function (data) {
               actualQuery = data.sql;
            });

            // then
            const expectedQuery = 'select "foo_id" as "id" from "bar" as "FOO"';
            actualQuery.should.equal(expectedQuery);

            // flakify(knex);
            // const actualData = await knex.table('bar AS FOO').select('foo_id AS id');
            //
            // // should always pass
            // actualData.should.have.deep.members(fooData);
            //
            // // should fail frequently (but not every time)
            // actualData.should.be.deep.equal(fooData);
         })

         it('using knex aliases', async () => {
            const fooData = [{id: 1}, {id: 2}, {id: 3}];
            // change fooData[0].id to non-ascending order make it fail
            const barData = [
               {id: 0, foo_id: fooData[0].id},
               {id: 1, foo_id: fooData[1].id},
               {id: 2, foo_id: fooData[2].id}
            ];
            await knex.table('foo').insert(fooData);
            await knex.table('bar').insert(barData);

            // when
            let actualQuery;
            await knex.select('foo.id').from({foo:'bar'}).on('query', function (data) {
               actualQuery = data.sql;
            });

            // then
            const expectedQuery = 'select "foo"."id" from "bar" as "foo"';
            actualQuery.should.equal(expectedQuery);

            // const actualData = await knex.select('foo_id AS id').from( { foo: 'bar'});
            //
            // // should always pass
            // actualData.should.have.deep.members(fooData);
            //
            // // should fail frequently (but not every time)
            // actualData.should.be.deep.equal(fooData);
         })

      });
   });

})
