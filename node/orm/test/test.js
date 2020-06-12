const recipeRepository = require('../src/repositories/recipe');
const chai = require('chai');
chai.should();

describe('recipeRepository', async () => {

    describe('No relationship model (single table)', async () => {

        it('getRecipes should return data', async () => {

            const recipes = await recipeRepository.getRecipes();
            console.dir(recipes);
            recipes.should.not.to.be.undefined;

        });

    });

    describe('One to many model (2 tables)', async () => {


        it('getUsersRecipes should return data', async () => {

            const usersRecipes = await recipeRepository.getUsersRecipes();
            console.dir(usersRecipes);

        });
    });

});

describe('Performance', async () => {

    it('ORM should be slower than native SQL client', async () => {

        const maxIterations = 200;
        let currentIterationCount = 0;
        while (currentIterationCount++ <= maxIterations) {
            const usersRecipes = await recipeRepository.getUsersRecipes();
            usersRecipes.should.not.to.be.undefined;
        }
    });

});

