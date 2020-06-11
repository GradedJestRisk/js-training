const tableName = 'recipe';
exports.seed = function (knex) {
    return knex(tableName).del()
        .then(function () {
            return knex(tableName).insert([
                {id: 0, name: 'flatbread', serving: 1, user_id: 0},
                {id: 1, name: 'bread',     serving: 2, user_id: 1},
            ]);
        });
};