const dbAgent = require('../db/db-agent')

const getRecipe = function (id) {
   return dbAgent.select().from('recipe').where({id}).first()
}

module.exports = {getRecipe}
