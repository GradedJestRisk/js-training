const dbAgent = require('./db/db-agent');
const bookshelf = require('bookshelf')(dbAgent);


const User = bookshelf.model('User', {
    tableName: "user"
});


const Recipe = bookshelf.model('Recipe', {
    tableName: 'recipe',
    user() {
        return this.belongsTo(User, "user_id", "id")
    }
    // ingredients() {
    //     return this.belongsToMany('Ingredient')
    // }
})

/*
const Ingredient = bookshelf.model('Ingredient', {
    tableName: 'ingredient',
    recipes() {
        return this.belongsToMany('Recipe')
    }
})
*/


module.exports = {dbAgent, Recipe};