const knex = require('../../knex/knex.js');

const getAll = async function()  {
    const recipes = await  knex.from('recipe').select('name', 'serving');
    return recipes;
}

module.exports = { getAll }