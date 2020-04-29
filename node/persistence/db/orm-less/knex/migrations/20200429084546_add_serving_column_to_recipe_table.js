const tableName = 'recipe';
const columnName = 'serving';

exports.up = function(knex) {
    return knex.schema.table(tableName, table => {
        table.integer(columnName);
    });
};

exports.down = function(knex) {
    return knex.schema.table(tableName, table => {
        table.dropColumn(columnName);
    });
};
