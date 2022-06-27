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

   describe('pluck', ()=>{
      it('should return value', async () => {
         await knex(tableName).insert(recipe)
         const recipesServing = await knex.from(tableName).pluck('serving').where({name: recipe.name});
         recipesServing[0].should.equal(4)
      })
   })

   // Chaining pluck and first throws an error
   // https://github.com/knex/knex/issues/4223
   describe('first', ()=>{
      it('should return first match', async () => {
         // given
         await knex(tableName).insert({
            dietType: 'vegetarian',
            name: 'caramelized-garlic-tart',
            serving: 4,
            source: 'https://www.theguardian.com/lifeandstyle/2008/mar/01/foodanddrink.shopping1'
         });

         await knex(tableName).insert({
            dietType: 'vegetarian',
            name: 'walnut-tagliatelle',
            serving: 2,
            source: 'https://www.foodrepublic.com/recipes/ottolenghi-style-tagliatelle-with-walnuts-recipe/'
         });

         // when
         const recipe = await knex.from(tableName).where({dietType: 'vegetarian'}).orderBy('name','asc').first();

         // then
         recipe.should.deep.equal({
            dietType: 'vegetarian',
            name: 'caramelized-garlic-tart',
            serving: 4,
            source: 'https://www.theguardian.com/lifeandstyle/2008/mar/01/foodanddrink.shopping1'
         })
      })
   })
   describe('limit', ()=>{
      it('should return array', async () => {
         // given
         await knex(tableName).insert({
            dietType: 'vegetarian',
            name: 'caramelized-garlic-tart',
            serving: 4,
            source: 'https://www.theguardian.com/lifeandstyle/2008/mar/01/foodanddrink.shopping1'
         });

         await knex(tableName).insert({
            dietType: 'vegetarian',
            name: 'walnut-tagliatelle',
            serving: 2,
            source: 'https://www.foodrepublic.com/recipes/ottolenghi-style-tagliatelle-with-walnuts-recipe/'
         });

         // when
         const recipes = await knex.from(tableName).where({dietType: 'vegetarian'}).orderBy('name','asc').limit(1);

         // then
         recipes.should.deep.equal([{
            dietType: 'vegetarian',
            name: 'caramelized-garlic-tart',
            serving: 4,
            source: 'https://www.theguardian.com/lifeandstyle/2008/mar/01/foodanddrink.shopping1'
         }]);
      })
   })


})
