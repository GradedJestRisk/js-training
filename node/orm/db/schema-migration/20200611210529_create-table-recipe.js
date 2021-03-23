const tableName = 'recipe';
exports.up = function(knex) {
    return knex.schema.createTable(tableName, table => {
        table.increments('id').primary();
        table.string('name').unique();
        table.integer('serving');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable(tableName);
};
