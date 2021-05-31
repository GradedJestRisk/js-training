const knex = require('../knex/knex.js')
const chai = require('chai')
const recipeRepository = require('../src/repositories/recipe')
chai.should()

const tableName = 'recipe'

describe('raw', async () => {

   const recipe = {
      dietType: 'vegetarian',
      name: 'caramelized-garlic-tart',
      serving: 4,
      source: 'https://www.theguardian.com/lifeandstyle/2008/mar/01/foodanddrink.shopping1'
   }

   beforeEach(async () => {
      await recipeRepository.removeAll()
   })

   it('should execute SQL', async () => {
      const result = await knex.raw('SELECT current_database()')
      result.rows[0].current_database.should.equal('cooking_db')
   })

   it('should use anonymous parameter (?)', async () => {
      await knex(tableName).insert(recipe)
      const result = await knex.raw('SELECT COUNT(1) FROM recipe WHERE name = ?', recipe.name)
      result.rows[0].count.should.equal('1')
   })

   it('should use anonymous parameter (?) in nested queries', async () => {
      await knex(tableName).insert(recipe)
      const result = await knex.select('name').from('recipe').whereRaw('name = ?', recipe.name)
      result[0].name.should.equal(recipe.name)
   })

   it('should use anonymous parameters in values (??)', async () => {
      await knex(tableName).insert(recipe)
      const result = await knex.raw('SELECT COUNT(1) FROM recipe WHERE name = ? AND serving = ??', [recipe.name, recipe.serving])
      result.rows[0].count.should.equal('1')
   })

   it('should use named parameters in values (:)', async () => {
      await knex(tableName).insert(recipe)
      const result = await knex.raw('SELECT COUNT(1) FROM recipe WHERE name = :name AND serving = :serving', {
         name: recipe.name,
         serving: recipe.serving
      })
      result.rows[0].count.should.equal('1')
   })

   it('should use named parameters in values (:) in nested queries', async () => {
      await knex(tableName).insert(recipe)
      const result = await knex.select('name').from('recipe').whereRaw('name = :name', { name: recipe.name })
      result[0].name.should.equal(recipe.name)
   })

   it('should use named parameter in name (::)', async () => {
      await knex(tableName).insert(recipe)
      const result = await knex.raw('SELECT COUNT(1) FROM :table: ', { table: 'recipe' })
      result.rows[0].count.should.equal('1')
   })

   it('should update JSONB column (??)', async () => {
      await knex.raw('DROP TABLE IF EXISTS foo')
      await knex.raw('CREATE TABLE foo (bar JSONB)')
      await knex.raw(`INSERT INTO foo (bar) VALUES ('{ "foz": "old"}')`)
      const value = 'new'

      // const escapedValue = '"new"';
      // const escapedValue = `"${value}"`;
      // const result = await knex.raw(`UPDATE foo SET bar = jsonb_set("bar", '{foz}', ?) RETURNING bar`, escapedValue);

      const result = await knex.raw(`UPDATE foo SET bar = jsonb_set("bar", '{foz}', ?) RETURNING bar`, `"${value}"`)

      result.rows[0].bar.foz.should.equal('new')
   })

})
