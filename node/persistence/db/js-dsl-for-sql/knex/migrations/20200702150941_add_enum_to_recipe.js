const TABLE_NAME = 'recipe';
const COLUMN_NAME = 'dietType';

exports.up = function(knex) {
    return knex.schema.table(TABLE_NAME, (table) => {
        table.enu(COLUMN_NAME, ['vegetarian', 'gluten-free', 'dairy-free', '']);
    });
};

exports.down = function(knex) {
    return knex.schema.table(TABLE_NAME, (table) => {
        table.dropColumn(COLUMN_NAME);
    });
};
