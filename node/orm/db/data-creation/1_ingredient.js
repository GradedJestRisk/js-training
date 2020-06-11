const tableName = 'ingredient';
exports.seed = function (knex) {
    return knex(tableName).del()
        .then(function () {
            return knex(tableName).insert([
                {id: 0, name: 'flour'},
                {id: 1, name: 'water' },
                {id: 2, name: 'yeast' }
            ]);
        });
};