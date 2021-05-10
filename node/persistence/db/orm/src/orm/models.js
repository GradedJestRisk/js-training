const dbAgent = require('../../db/db-agent');
const bookshelf = require('bookshelf')(dbAgent);
bookshelf.plugin('bookshelf-virtuals-plugin');

const User = bookshelf.model('User', {
   tableName: 'user',
   recipes() {
      return this.hasMany(Recipe, "user_id", "id")
   },
   // https://github.com/bookshelf/virtuals-plugin/wiki/Bookshelf-Virtuals-Plugin
   // you can't set a non-existing property
   // virtuals: {
   //    correlation: {
   //       get() {
   //          return this.get('correlation');
   //       },
   //       set(value) {
   //          this.set('correlation', value);
   //       }
   //    }
   // }
});

const Recipe = bookshelf.model('Recipe', {
   tableName: 'recipe',
   user() {
      return this.belongsTo(User, "user_id", "id")
   },
   // https://bookshelfjs.org/tutorial-many-to-many.html
   ingredients() {
       return this.belongsToMany(Ingredient, "recipes_ingredients", "recipe_id", "ingredient_id")
   },
   initialize() {
      this.on('fetching', function(model, columns, options) {
         console.log('Recipe is about be be fetched..');
         //options.query.where('status', 'active')
      })
   }
})

const Ingredient = bookshelf.model('Ingredient', {
   tableName: 'ingredient',
   recipes() {
      return this.belongsToMany(Recipe, "recipes_ingredients", "ingredient_id", "recipe_id")
   }
})



module.exports = {Recipe, User, Ingredient};
