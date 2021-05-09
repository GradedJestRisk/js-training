const tableName = 'recipes_ingredients';
exports.seed = function (knex) {
    return knex(tableName).del()
        .then(function () {
            return knex(tableName).insert([
                {recipe_id: 0, ingredient_id: 0, quantity: 100,  unit: 'gram'},
                {recipe_id: 0, ingredient_id: 1, quantity: 50,   unit: 'gram'},
                {recipe_id: 1, ingredient_id: 0, quantity: 1000, unit: 'gram'},
                {recipe_id: 1, ingredient_id: 1, quantity: 700,  unit: 'gram'},
                {recipe_id: 1, ingredient_id: 2, quantity: 15,   unit: 'gram'},
            ]);
        });
};