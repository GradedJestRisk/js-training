const ormModel = require('../orm/models');
const Recipe = require('../entities/recipe');

const getRecipes = async function () {
   // https://bookshelfjs.org/api.html#Model-instance-fetchAll
   return (await new ormModel.Recipe().fetchAll()).toJSON();
}

const getRecipesAsEntity = async function () {
   const ormRecipes = await new ormModel.Recipe().fetchAll();
   const entitiesRecipes = ormRecipes.models.map((recipe)=>new Recipe(recipe.attributes));
   return entitiesRecipes;
}

const getRecipesById = async function (id) {
   const recipes = await ormModel.Recipe.where("id", id).fetch({withRelated: ["user"]});
   return recipes.toJSON();
}

const getRecipesByIngredientId = async function (id) {
   const user = await ormModel.Ingredient.where("id", id).fetch({withRelated: ['recipes']});
   return user.related('recipes').toJSON();
}

const create = async function (recipe) {
   const ormRecipe = new ormModel.Recipe(recipe);
   await ormRecipe.save(null, {method: 'insert'});
}

const update = async function (recipe) {
   const ormRecipe = new ormModel.Recipe(recipe);
   await ormRecipe.save();
}

const clear = async function (recipe) {
   const ormRecipe = new ormModel.Recipe(recipe);
   await ormRecipe.destroy();
}
module.exports = { getRecipes, getRecipesById, getRecipesAsEntity, getRecipesByIngredientId, create, update, clear};
