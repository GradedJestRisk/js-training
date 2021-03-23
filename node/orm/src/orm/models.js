const dbAgent = require('../../db/db-agent');
const bookshelf = require('bookshelf')(dbAgent);

const User = bookshelf.model('User', {
   tableName: 'user',
   recipes() {
      return this.hasMany(Recipe, "user_id", "id")
   }
});

const Recipe = bookshelf.model('Recipe', {
   tableName: 'recipe',
   user() {
      return this.belongsTo(User, "user_id", "id")
   },
   // https://bookshelfjs.org/tutorial-many-to-many.html
   ingredients() {
       return this.belongsToMany(Ingredient, "recipes_ingredients", "recipe_id", "ingredient_id")
   }
})

const Ingredient = bookshelf.model('Ingredient', {
   tableName: 'ingredient',
   recipes() {
      return this.belongsToMany(Recipe, "recipes_ingredients", "ingredient_id", "recipe_id")
   }
})



module.exports = {Recipe, User, Ingredient};
