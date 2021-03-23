const { User } = require('../orm/models');

const getRecipesByUserId = async function (id) {
   const user = await User.where("id", id).fetch({withRelated: ['recipes']});
   return user.related('recipes').toJSON();
}



module.exports = { getRecipesByUserId};
