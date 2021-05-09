const tools = require('./src/tools.js');
const recipeRepository = require('./src/repositories/recipe.js');

(async function () {

   await tools.testDatabaseConnection();

   const recipes = await recipeRepository.getRecipes();
   recipes.forEach((recipe) => {
      console.log('recipe n°' + recipe.id + ': ' + recipe.name + ', serving ' + recipe.serving)
   })

})()

