const TABLE_NAME = 'recipe';
const COLUMN_NAME = 'serving';

exports.up = function(knex) {
    return knex.raw('ALTER TABLE recipe ADD CONSTRAINT check_serving CHECK ( serving IN ( 2, 4, 8) ) NOT VALID');

    // Can't alter a check constraint
    // https://github.com/knex/knex/issues/1699
    // return knex.schema.alterTable(TABLE_NAME, (table) => {
    //     table.enu(COLUMN_NAME, [2, 4]).alter();
    // });
};

exports.down = function(knex) {
    return knex.raw('ALTER TABLE recipe DROP CONSTRAINT check_serving');
};
