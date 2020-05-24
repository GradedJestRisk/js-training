const knex = require('../../knex/knex.js');
const tableName = 'recipe';
// knex.on('query', console.log)

const getAll = async function()  {
    const recipes = await  knex.from(tableName).select('name', 'serving');
    return recipes;
}

const get = async function({ minServing })  {
    const recipes = await  knex.from(tableName).select('name', 'serving').where('serving', '>=', minServing);
    return recipes;
}

const getByName = async function(name)  {
    const recipes = await  knex.from(tableName).select('name', 'serving').where('name');
    return recipes;
}

const count = async function()  {
    return Number( (await knex.from(tableName).count('name').first()).count);
}

const create = async function(recipe)  {
   await knex(tableName).insert([recipe]);
}

const removeAll = async function () {
    await knex(tableName).del();
};

module.exports = { getAll, get, create, getByName, removeAll, count };