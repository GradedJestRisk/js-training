const knex = require('../knex/knex.js')
const chai = require('chai')
const recipeRepository = require('../src/repositories/recipe')
chai.should()

const tableName = 'recipe'

describe('transaction', async () => {

   const recipe = {
      dietType: 'vegetarian',
      name: 'caramelized-garlic-tart',
      serving: 4,
      source: 'https://www.theguardian.com/lifeandstyle/2008/mar/01/foodanddrink.shopping1'
   }

   beforeEach(async () => {
      await recipeRepository.removeAll()
   })

   describe('transaction is aborted', async () => {

      it('when an error is thrown', async () => {

         try {
            await knex.transaction(async trx => {
               await trx(tableName).insert(recipe)
               await trx('unknownTable').insert(recipe)
            })
         } catch (error) {
            //console.error("Error raised:" + error);
         }

         const count = await recipeRepository.count()
         count.should.equal(0)
      })

      it('when rollback is called', async () => {

         const trx = await knex.transaction()
         let result

         try {
            await knex(tableName).insert(recipe).transacting(trx)
            await trx.rollback()
         } catch (error) {
            console.error('Error raised:' + error)
         }

         // true when either committed or rolled back
         trx.isCompleted().should.be.true

         const count = await recipeRepository.count()
         count.should.equal(0)
      })

   })

   describe('isolation levels', async () => {

      const isolationLevelsPG = {
         // https://www.postgresql.org/docs/current/transaction-iso.html
         // "PostgreSQL's Read Uncommitted mode behaves like Read Committed."
         'READ_UNCOMMITED': 'read committed',
         'READ_COMMITED': 'read committed',
         'REPEATABLE_READ': 'repeatable read',
         'SERIALIZABLE': 'serializable'
      }

      it('REPEATABLE_READ prevents phantom read', async () => {

         // phantom read (https://www.postgresql.org/docs/current/transaction-iso.html)
         // A transaction re-executes a query returning a set of rows that satisfy a search condition
         // and finds that the set of rows satisfying the condition has changed due to another recently-committed transaction.
         const trx1 = await knex.transaction()

         const trx2 = await knex.transaction({
            isolationLevel: isolationLevelsPG.REPEATABLE_READ
         })

         try {
            const before = (await trx2(tableName).select().count())[0].count
            await trx1(tableName).insert(recipe)
            const after = (await trx2(tableName).select().count())[0].count
            after.should.equal(before).should.equal(0);
         } catch (error) {
            //console.error("Error raised:" + error);
         }

         await recipeRepository.removeAll()

         const trx3 = await knex.transaction()

         const trx4 = await knex.transaction({
            isolationLevel: isolationLevelsPG.READ_COMMITED
         })

         try {
            await knex(tableName).insert(recipe)
            const before = parseInt((await trx4(tableName).select().count())[0].count);
            await trx3(tableName).del()
            const afterTrx3 = parseInt((await trx3(tableName).select().count())[0].count);
            await trx3.commit()
            const afterTrx4 = parseInt((await trx4(tableName).select().count())[0].count);
            before.should.equal(1)
            afterTrx3.should.equal(0)
            afterTrx4.should.equal(0)
         }
         catch (error) {
            console.error("Error raised:" + error);
         }

      })

   })

   it('transactions can be mixed', async () => {

      try {
         await knex.transaction(async (trx) => {
            await recipeRepository.create(recipe)
            await trx(tableName).insert(recipe)
            await trx.rollback()
         })
      } catch (error) {
         //console.error("Error raised:" + error);
      }

      const count = await recipeRepository.count()
      count.should.equal(1)

   })

   describe('transaction can return a value', async () => {

      it('when transaction succeed', async () => {

         const RETURN_CODE = 1

         let actualCode
         try {
            actualCode = await knex.transaction(async (trx) => {
               await trx(tableName).insert(recipe)
               return RETURN_CODE
            })
         } catch (error) {
            console.error('Error raised in transaction:' + error)
         }

         actualCode.should.equal(RETURN_CODE)

      })

      it('when transaction fails', async () => {

         const RETURN_CODE = 1
         const expectedErrorMessage = 'Transaction rejected with non-error: undefined'

         let actualCode
         let errorMessage

         try {
            actualCode = await knex.transaction(async (trx) => {
               await trx.rollback()
            })
         } catch (error) {
            errorMessage = error.message
//            console.error('Error raised in transaction:' + error)
            return RETURN_CODE
         }

         actualCode.should.equal(RETURN_CODE)
         errorMessage.should.equal(expectedErrorMessage)
      })

   })

   it('is 20% slower (than with implicit transaction)', async () => {

      const insertWithDefaultTransaction = async function () {
         return knex(tableName).insert(recipe)
      }

      const insertWithDedicatedTransaction = async () => {
         await knex.transaction(async (trx) => {
            await trx(tableName).insert(recipe)
         })
      }

      const MAX_ITERATIONS = 200
      let currentIterationCount

      const begin = Date.now()
      currentIterationCount = 0
      while (currentIterationCount++ <= MAX_ITERATIONS) {
         await insertWithDefaultTransaction()
      }
      const duration = Date.now() - begin

      const beginTransaction = Date.now()
      currentIterationCount = 0
      while (currentIterationCount++ <= MAX_ITERATIONS) {
         await insertWithDedicatedTransaction()
      }
      const durationTransaction = Date.now() - beginTransaction

      // console.log('With transaction  (ms): ' + durationTransaction)
      // console.log('Without transaction (ms): ' + duration)

      const quickerPercent = (durationTransaction - duration) / duration * 100
      durationTransaction.should.be.greaterThan(duration)
      quickerPercent.should.be.greaterThan(20)
      quickerPercent.should.be.below(100)
   })

})
