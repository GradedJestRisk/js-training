const recipeRepository = require('../src/repositories/recipe');
const chai = require('chai');
chai.should();

const nativeClient = require('../db/native-client');

describe('Performance', async () => {

   it('ORM should be slower than native SQL client', async () => {

      const MAX_ITERATIONS = 200;
      let currentIterationCount;

      const beginORM = Date.now();
      currentIterationCount = 0;
      while (currentIterationCount++ <= MAX_ITERATIONS) {
         const usersRecipes = await recipeRepository.getUsersRecipes();
      }
      const durationORM = Date.now() - beginORM;
      console.log('ORM (ms): ' + durationORM);

      const beginNativeClient = Date.now();
      currentIterationCount = 0;
      while (currentIterationCount++ <= MAX_ITERATIONS) {
         nativeClient.query('SELECT COUNT(1) FROM recipe', (err, res) => {
            if (err) {
               console.error(err);
               return;
            }
         });
      }
      nativeClient.end();
      const durationNativeClient = Date.now() - beginNativeClient;
      console.log('Native client (ms): ' + durationNativeClient);

      durationORM.should.be.greaterThan(durationNativeClient);

   });

});

