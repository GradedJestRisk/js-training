const recipeRepository = require('../src/repositories/recipe');
const chai = require('chai');
chai.should();

describe('recipeRepository', async () => {

    it('getUsersRecipes should return data', async () => {

        const maxIterations = 20000;
        let currentIterationCount = 0;
        while (currentIterationCount++ <= maxIterations) {
            const usersRecipes = recipeRepository.getUsersRecipes();
            usersRecipes.should.not.to.be.undefined;
        }
    });

});