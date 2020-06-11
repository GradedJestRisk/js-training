const tableName = 'user';
exports.up = function(knex) {
    return knex.schema.createTable(tableName, table => {
        table.integer('id').notNullable().unique().primary()
        table.string('name')
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable(tableName);
};
