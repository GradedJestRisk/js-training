const recipeRepository = require('../src/repositories/recipe-repository');
const testHelper = require('./test-helper');
const chai = require('chai');
chai.should();

const nativeClient = require('../db/native-client');

describe('Performance', async () => {

   let user;
   let flour, water, salt, yeast;
   let flatBread, bread;

   beforeEach(async () => {
      await testHelper.emptyAllTables();
      user = await testHelper.createUser({name: 'John'});

      flour = await testHelper.createIngredient({name: 'flour'});
      water = await testHelper.createIngredient({name: 'water'});
      salt = await testHelper.createIngredient({name: 'salt'});
      yeast = await testHelper.createIngredient({name: 'yeast'});

      flatBread = await testHelper.createRecipe({
         name: "flatbread",
         serving: 1,
         user_id: user.id,
         elements: [{
            ingredient_id: flour.id,
            quantity: 1,
            unit: 'kilogram',
         }, {
            ingredient_id: water.id,
            quantity: 600,
            unit: 'milliliter',
         },
            {
               ingredient_id: salt.id,
               quantity: 18,
               unit: 'gram',
            }]
      });
      bread = await testHelper.createRecipe({
         name: "bread",
         serving: 1,
         user_id: user.id,
         elements: [{
            ingredient_id: flour.id,
            quantity: 1,
            unit: 'kilogram',
         }, {
            ingredient_id: water.id,
            quantity: 600,
            unit: 'milliliter',
         }, {
            ingredient_id: salt.id,
            quantity: 18,
            unit: 'gram',
         }, {
            ingredient_id: yeast.id,
            quantity: 8,
            unit: 'gram',
         }]
      });
   });


   it('ORM should be slower than native SQL client', async () => {

      const MAX_ITERATIONS = 200;
      let currentIterationCount;

      const beginORM = Date.now();
      currentIterationCount = 0;
      while (currentIterationCount++ <= MAX_ITERATIONS) {
         await recipeRepository.getRecipesById(flatBread.id);
      }
      const durationORM = Date.now() - beginORM;
      console.log('ORM (ms): ' + durationORM);

      const beginNativeClient = Date.now();
      currentIterationCount = 0;
      while (currentIterationCount++ <= MAX_ITERATIONS) {
         nativeClient.query(`SELECT * FROM recipe r INNER JOIN "user" u ON r.user_id = u.id WHERE r.id=${flatBread.id}`, (err, res) => {
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

