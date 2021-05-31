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

         try {
            await knex.transaction(async trx => {
               await trx(tableName).insert(recipe)
               await trx.rollback()
            })
         } catch (error) {
            //console.error('Error raised:' + error)
         }

         const count = await recipeRepository.count()
         count.should.equal(0)

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

      const MAX_ITERATIONS = 200;
      let currentIterationCount;

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

      const quickerPercent = (durationTransaction - duration) / duration * 100;
      durationTransaction.should.be.greaterThan(duration);
      quickerPercent.should.be.greaterThan(20);
      quickerPercent.should.be.below(100);
   })

})
