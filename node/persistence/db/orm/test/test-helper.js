const dbAgent = require('../db/db-agent')

const createUser = async function ({name}) {
   const result = await dbAgent.raw(`INSERT INTO "user" (name) VALUES (:name) RETURNING *`, {name});
   return result.rows[0];
}

const createIngredient = async function ({name}) {
   const result = await dbAgent.raw(`INSERT INTO "ingredient" (name) VALUES (:name) RETURNING *`, {name});
   return result.rows[0];
}

const createRecipe = async function ({name, serving, user_id, elements}) {

   const result = await dbAgent.raw(`INSERT INTO "recipe" (name, serving, user_id) VALUES (:name, :serving, :user_id) RETURNING (id)`,
      {name, serving, user_id});

   const recipeId = result.rows[0].id;

   await Promise.all(elements.map((element) => {
      return dbAgent.raw(`INSERT INTO "recipes_ingredients" (recipe_id, ingredient_id, quantity, unit)
                         VALUES (:recipe_id, :ingredient_id, :quantity, :unit)`,
         {recipe_id: recipeId, ingredient_id: element.ingredient_id, quantity: element.quantity, unit: element.unit});

   }));

   return {id: recipeId, name, serving, user_id, elements}
}

const getRecipe = function (id) {
   return dbAgent.select().from('recipe').where({id}).first()
}

const emptyAllTables = async function () {
   try {
      await dbAgent.raw('TRUNCATE TABLE "user" CASCADE');
      await dbAgent.raw('TRUNCATE TABLE ingredient CASCADE');
      await dbAgent.raw('TRUNCATE TABLE recipes_ingredients CASCADE');
      await dbAgent.raw('TRUNCATE TABLE recipe CASCADE');
   } catch (error) {
      console.log(error);
   }
};


module.exports = {getRecipe, emptyAllTables, createUser, createIngredient, createRecipe}
