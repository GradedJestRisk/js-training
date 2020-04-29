const tableName = 'recipe';
const columnName = 'source';

exports.up = function(knex) {
    return knex.schema.table(tableName, table => {
        table.text(columnName);
    });
};

exports.down = function(knex) {
    return knex.schema.table(tableName, table => {
        table.dropColumn(columnName);
    });
};
