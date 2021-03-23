const chai = require('chai');
chai.should();

const recipeRepository = require('../src/repositories/recipe-repository');
const userRepository = require('../src/repositories/user-repository');
const Recipe = require('../src/entities/recipe');
const testHelper = require('./test-helper');

describe('recipeRepository', async () => {

   beforeEach(async () => {
      await testHelper.emptyAllTables();
   });

   describe('read', async () => {

      describe('fetch*** does a SQL SELECT', async () => {

         let user;
         let flour, water, salt, yeast;
         let flatBread, bread;

         beforeEach(async () => {
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
         })

         afterEach(async () => {
            await testHelper.emptyAllTables();
         })

         describe('fetchAll retrieve all instances', async () => {

            it('should return the model', async () => {


               const expectedRecipes = [{
                  id: flatBread.id,
                  name: flatBread.name,
                  serving: flatBread.serving,
                  user_id: flatBread.user_id
               }, {
                  id: bread.id,
                  name: bread.name,
                  serving: bread.serving,
                  user_id: bread.user_id
               }];

               const recipes = await recipeRepository.getRecipes();
               recipes.should.deep.equal(expectedRecipes);

            });

            it('should return an entity, if using constructor', async () => {

               const expectedRecipes = [{
                  id: flatBread.id,
                  name: flatBread.name,
                  serving: flatBread.serving,
               }, {
                  id: bread.id,
                  name: bread.name,
                  serving: bread.serving,
               }];

               const recipes = await recipeRepository.getRecipesAsEntity();
               recipes.should.deep.equal(expectedRecipes);

               const recipe = recipes[0];
               (recipe instanceof Recipe).should.be.true;
               recipe.feedsACrowd().should.be.false;
            });

         });

         describe('fetch retrieve a set of instances', async () => {

            describe('fetch({withRelated: ["model"]} should also fetch relationships', async () => {

               it('from N:1 relationship', async () => {

                  const expectedRecipe = {
                     id: flatBread.id,
                     name: flatBread.name,
                     serving: flatBread.serving,
                     user_id : user.id,
                     "user": {
                        "id": user.id,
                        "name": user.name
                     }
                  }

                  const recipe = await recipeRepository.getRecipesById(expectedRecipe.id);
                  recipe.should.deep.equal(expectedRecipe);

               });

               it('from 1:N relationship', async () => {

                  const expectedRecipes = [{
                     id: flatBread.id,
                     name: flatBread.name,
                     serving: flatBread.serving,
                     user_id : user.id
                  },{
                     id: bread.id,
                     name: bread.name,
                     serving: bread.serving,
                     user_id : user.id
                  }
                  ];

                  const recipes = await userRepository.getRecipesByUserId(user.id);
                  recipes.should.deep.equal(expectedRecipes);

               });

               it('from N:N relationship', async () => {


                  const expectedRecipes = [   {
                     id: flatBread.id,
                     name: flatBread.name,
                     serving: flatBread.serving,
                     user_id: flatBread.user_id
                  }, {
                     id: bread.id,
                     name: bread.name,
                     serving: bread.serving,
                     user_id: bread.user_id
                  }];

                  const recipes = await recipeRepository.getRecipesByIngredientId(flour.id);
                  recipes[0].should.deep.include(expectedRecipes[0]);
                  recipes[1].should.deep.include(expectedRecipes[1]);

               });
            });
         });

      });

   });

   describe('write', async () => {

      describe('save', async () => {

         it('save(null, {method: "insert"}) does a SQL INSERT', async () => {

            const user = await testHelper.createUser({name: 'John'});
            const recipe = new Recipe({id: 5, name: 'foo', serving: 2})
            recipe.user_id = user.id;
            await recipeRepository.create(recipe);
            const recipeInDatabase = await testHelper.getRecipe(recipe.id);
            recipeInDatabase.should.deep.equal(recipe);

         });

         it('save() does an SQL UPDATE', async () => {

            const user = await testHelper.createUser({name: 'John'});
            const recipe = new Recipe({id: 5, name: 'foo', serving: 2})
            recipe.user_id = user.id;
            await recipeRepository.create(recipe);

            recipe.serving = 4;
            await recipeRepository.update(recipe);

            const recipeInDatabase = await testHelper.getRecipe(recipe.id);
            recipeInDatabase.should.deep.equal(recipe);

         });

      });

      describe('remove', async () => {

         it('destroy does a SQL DELETE', async () => {

            const user = await testHelper.createUser({name: 'John'});
            const recipe = new Recipe({id: 5, name: 'foo', serving: 2})
            recipe.user_id = user.id;
            await recipeRepository.create(recipe);
            await recipeRepository.clear(recipe);

            const recipeInDatabase = await testHelper.getRecipe(recipe.id);
            (recipeInDatabase === undefined).should.be.true;

         });

      });

   });

});
