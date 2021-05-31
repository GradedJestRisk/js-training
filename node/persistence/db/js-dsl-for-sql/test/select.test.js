const knex = require('../knex/knex.js')
const chai = require('chai')
const recipeRepository = require('../src/repositories/recipe')
chai.should()

const tableName = 'recipe'

describe('select', async () => {

   const recipe = {
      dietType: 'vegetarian',
      name: 'caramelized-garlic-tart',
      serving: 4,
      source: 'https://www.theguardian.com/lifeandstyle/2008/mar/01/foodanddrink.shopping1'
   }

   beforeEach(async () => {
      await recipeRepository.removeAll()
   })

   it('should select all columns', async () => {
      await knex(tableName).insert(recipe)
      const recipes = await knex.from(tableName).select()
      recipes[0].should.deep.equal(recipe)
   })

})
