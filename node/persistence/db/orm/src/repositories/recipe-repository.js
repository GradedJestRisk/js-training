const assert = require('assert');
const ormModel = require('../orm/models');
const Recipe = require('../entities/recipe');
const bookshelfModel = require('bookshelf/lib/model');

// debug query
//https://github.com/bookshelf/bookshelf/issues/1822#issuecomment-530149914

// or
// https://github.com/bookshelf/bookshelf/issues/1319#issuecomment-232005974
// model.query(function(qb) {
//    qb.debug(true);
// }).fetch()

const getRecipes = async function () {
   // https://bookshelfjs.org/api.html#Model-instance-fetchAll
   return (await new ormModel.Recipe().fetchAll()).toJSON();
}

const getRecipesAsEntity = async function () {
   const ormRecipes = await new ormModel.Recipe().fetchAll();
   const entitiesRecipes = ormRecipes.models.map((recipe) => new Recipe(recipe.attributes));
   return entitiesRecipes;
}

const getRecipesById = async function (id) {

   const query = (await ormModel.Recipe.where("id", id).fetch({withRelated: ["user"]})).query().toSQL();
   console.log('Debug a single call: show the already executed query');
   console.dir(query);

   // const originalFunction = bookshelfModel.prototype.fetch;
   //
   // const patchedFunction = {
   //    apply (target, ctx, args) {
   //       console.log("patched function is invoked with arguments: " + args)
   //
   //       arguments[1]._knex.correlation = arguments[2][0].correlation;
   //       delete arguments[2][0].correlation;
   //
   //       return Reflect.apply(...arguments)
   //    }
   // }
   // const proxyFunction = new Proxy(originalFunction, patchedFunction);
   // bookshelfModel.prototype.fetch = proxyFunction;

   // Brief Version
   //const recipesNative = await ormModel.Recipe.where("id", id).fetch({withRelated: ["user"]});
   const recipesNative = await ormModel.Recipe.where("id", id).fetch({withRelated: ["user"]});

   // Knex-explicit version
   const criteria = {where: {"id": id}};
   const recipesKnex = await ormModel.Recipe.query(criteria).fetch({withRelated: ["user"]});

   assert.deepEqual(recipesNative.attributes, recipesKnex.attributes);

   return recipesNative.toJSON();
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
module.exports = {getRecipes, getRecipesById, getRecipesAsEntity, getRecipesByIngredientId, create, update, clear};
