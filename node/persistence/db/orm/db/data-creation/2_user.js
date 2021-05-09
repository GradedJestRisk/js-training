const tableName = 'user';
exports.seed = function (knex) {
    return knex(tableName).del()
        .then(function () {
            return knex(tableName).insert([
                {id: 0, name: 'john'},
                {id: 1, name: 'jack'},
            ]);
        });
};