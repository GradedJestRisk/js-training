const { getAll, get, testDatabaseConnection } = require('./src/repositories/recipe.js');

(async function () {

    testDatabaseConnection();


    try {
        const recipes = await getAll();
    }
    catch (error){
        console.log(error);
    }
    const recipeCount = recipes.length;
    console.log(`Here are the ${recipeCount} recipes:`);

    for (recipe of recipes) {
        console.log(` * ${recipe.name} serves ${recipe.serving} people`);
    }

    console.log('---------------------');

    const minServing = 10;
    const recipeOnMinServing = await get({ minServing});
    console.log(`Here are the ${recipeCount} recipes serving at least ${minServing} people :`);

    for (recipe of recipeOnMinServing) {
        console.log(` * ${recipe.name} serves ${recipe.serving} people`);
    }


})()

