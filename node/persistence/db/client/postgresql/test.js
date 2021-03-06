const connectionPool = require('./connectionPool')

const chai = require('chai')
chai.should()

const recipe = {
   name: 'caramelized-garlic-tart',
   serving: 4,
   source: 'https://www.theguardian.com/lifeandstyle/2008/mar/01/foodanddrink.shopping1'
}

const existingRecipe =
   {
      'name': 'saag-feta',
      'serving': 4,
      'source': 'https://owiowifouettemoi.com/2019/05/08/saag-feta/'
   }

describe('connexion pool', async () => {

   it('should perform unbinded query', async () => {
      const { rows } = await connectionPool.query('SELECT * FROM recipe WHERE name = \'saag-feta\'')
      rows[0].should.be.deep.equal(existingRecipe)
   })

   it('should perform binded query', async () => {
      const { rows } = await connectionPool.query('SELECT * FROM recipe WHERE name = $1', ['caramelized-garlic-tart'])
      rows[0].should.be.deep.equal(recipe)
   })

   it('should perform transaction', async () => {
      const insertQuery = 'BEGIN; INSERT INTO "recipe" ("name", "serving", "source") VALUES (\'some-caramelized-garlic-tart\',\'4\',\'http:\/\/www.theguardian.com/lifeandstyle/2008/mar/01/foodanddrink.shopping1\'); COMMIT;'
      await connectionPool.query(insertQuery)
   })

   it('should perform transaction quickly', async () => {

      const insertQuery = 'BEGIN; INSERT INTO "recipe" ("name", "serving", "source") VALUES (\'another-caramelized-garlic-tart\',\'4\',\'https:\/\/www.theguardian.com/lifeandstyle/2008/mar/01/foodanddrink.shopping1\'); COMMIT;'
      const MAX_ITERATIONS = 200
      let currentIterationCount

      const begin = Date.now()
      currentIterationCount = 0
      while (currentIterationCount++ <= MAX_ITERATIONS) {
         await connectionPool.query(insertQuery)
      }
      const duration = Date.now() - begin
      console.log('Duration (ms): ' + duration)
      duration.should.be.greaterThan(0)

   })

})
