const tableName = 'recipe';
exports.up = function(knex) {
    return knex.schema.createTable(tableName, table => {
        table.string('name')
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable(tableName);
};
