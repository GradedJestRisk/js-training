const { dbAgent, Recipe } = require('../../orm')

const testDatabaseConnection = async function()  {
    const rawResult = await dbAgent.raw('SELECT current_database() AS "databaseName"' );
    const databaseName = rawResult.rows[0].databaseName;
    console.log('Successfully connected to ' + databaseName);
}

const printRecipe = async function () {

    const recipes = await new Recipe().fetchAll();
    console.dir(recipes.toJSON());

    // new Recipe({id: 1}).fetch({withRelated: ['ingredient']}).then((recipe) => {
    //     console.log(recipe.related('ingredient').toJSON())
    // }).catch((error) => {
    //     console.error(error)
    // })

}


const getUsersRecipes = async function () {

    const recipes = await Recipe.where("id",0).fetch({withRelated: ["user"]});
    return recipes.toJSON();

    // new Recipe({id: 1}).fetch({withRelated: ['ingredient']}).then((recipe) => {
    //     console.log(recipe.related('ingredient').toJSON())
    // }).catch((error) => {
    //     console.error(error)
    // })

}

module.exports = { testDatabaseConnection, printRecipe, getUsersRecipes };