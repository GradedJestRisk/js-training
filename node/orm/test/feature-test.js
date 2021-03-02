const chai = require('chai');
chai.should();

const recipeRepository = require('../src/repositories/recipe');
const Recipe = require('../src/entities/recipe');
const helper = require('./helper');

describe('recipeRepository', async () => {

   describe('read does a SQL SELECT', async () => {

      describe('fetchAll retrieve all instances', async () => {

         it('should return the model, without relationship', async () => {

            const expectedRecipes = [{
               id: 0,
               name: "flatbread",
               serving: 1,
               user_id: 0
            }, {
               id: 1,
               name: "bread",
               serving: 2,
               user_id: 1,
            }];

            const recipes = await recipeRepository.getRecipes();
            recipes.should.deep.equal(expectedRecipes);

         });

      });

      describe('fetch({withRelated: ["model"]})', async () => {

         it('should return model and matching relationship', async () => {

            const user = {
               id: 0,
               name: "john"
            };

            const expectedRecipe = {
               id: 0,
               name: "flatbread",
               serving: 1,
               user,
               user_id: user.id
            };

            const recipe = await recipeRepository.getRecipesById(expectedRecipe.id);
            recipe.should.deep.equal(expectedRecipe);

         });
      });

      describe('using entity constructor', async () => {

         it('should return entities', async () => {

            const expectedRecipes = [{
               id: 0,
               name: "flatbread",
               serving: 1
            }, {
               id: 1,
               name: "bread",
               serving: 2
            }];

            const recipes = await recipeRepository.getRecipesAsEntity();
            recipes.should.deep.equal(expectedRecipes);

            const recipe = recipes[0];
            (recipe instanceof Recipe).should.be.true;
            recipe.feedsACrowd().should.be.false;
         });

      });

   });

   describe('write', async () => {

      describe('save', async () => {

         it('save(null, {method: "insert"}) does a SQL INSERT', async () => {

            const recipe = new Recipe({ id: 5, name : 'foo', serving : 2})
            recipe.user_id = 0;
            await recipeRepository.create(recipe);
            const recipeInDatabase = await helper.getRecipe(recipe.id);
            recipeInDatabase.should.deep.equal(recipe);

         });

         it('save() does an SQL UPDATE', async () => {

            const recipe = new Recipe({ id: 5, name : 'foo', serving : 2})
            recipe.user_id = 0;
            await recipeRepository.create(recipe);

            recipe.serving = 4;
            await recipeRepository.update(recipe);

            const recipeInDatabase = await helper.getRecipe(recipe.id);
            recipeInDatabase.should.deep.equal(recipe);

         });

      });


      describe('remove', async () => {

         it('destroy does a SQL DELETE', async () => {

            const recipe = new Recipe({ id: 5, name : 'foo', serving : 2})
            recipe.user_id = 0;
            await recipeRepository.create(recipe);
            await recipeRepository.clear(recipe);

            const recipeInDatabase = await helper.getRecipe(recipe.id);
            (recipeInDatabase === undefined).should.be.true;

         });

      });

   });

});
