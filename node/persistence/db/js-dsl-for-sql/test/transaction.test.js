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

   it('error in transaction should prevent data insertion', async () => {

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

   it('call rollback in transaction should prevent data insertion', async () => {

      try {
         await knex.transaction(async trx => {
            await trx(tableName).insert(recipe);
            await trx.rollback();
         })
      } catch (error) {
         //console.error('Error raised:' + error)
      }

      const count = await recipeRepository.count();
      count.should.equal(0);

   })

   it('call rollback in transaction does not affect other transaction', async () => {

      try {
         await knex.transaction(async trx => {
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

   it('is more slowly than without transaction ', async () => {

      const insert = async function () {
         return knex(tableName).insert(recipe)
      }

      const insertTransaction = async function () {
         await knex.transaction(async trx => {
            await trx(tableName).insert(recipe)
         })
      }
      const MAX_ITERATIONS = 200
      let currentIterationCount

      const begin = Date.now()
      currentIterationCount = 0
      while (currentIterationCount++ <= MAX_ITERATIONS) {
         await insert()
      }
      const duration = Date.now() - begin

      const beginTransaction = Date.now()
      currentIterationCount = 0
      while (currentIterationCount++ <= MAX_ITERATIONS) {
         await insertTransaction()
      }
      const durationTransaction = Date.now() - beginTransaction

      // console.log('With transaction  (ms): ' + durationTransaction)
      // console.log('Without transaction (ms): ' + duration)
      durationTransaction.should.be.greaterThan(duration)
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
         const expectedErrorMessage = 'Transaction rejected with non-error: undefined';

         let actualCode;
         let errorMessage;

         try {
            actualCode = await knex.transaction(async (trx) => {
               await trx.rollback()
            })
         } catch (error) {
            errorMessage = error.message;
//            console.error('Error raised in transaction:' + error)
            return RETURN_CODE
         }

         actualCode.should.equal(RETURN_CODE)
         errorMessage.should.equal(expectedErrorMessage)
      })

   })

})
