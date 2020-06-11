const recipeRepository = require('./src/repositories/recipe.js');

(async function () {
    recipeRepository.testDatabaseConnection();
    recipeRepository.printRecipe();
    recipeRepository.printUserRecipe();
})()

