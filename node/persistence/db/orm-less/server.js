const {getAll} = require('./src/repositories/recipe.js');

(async function () {
    const recipes = await getAll();
    const recipeCount = recipes.length;
    console.log(`Here are the ${recipeCount} recipes:`);

    for (recipe of recipes) {
        console.log(` * ${recipe.name} serves ${recipe.serving} people`);
    }
})()

