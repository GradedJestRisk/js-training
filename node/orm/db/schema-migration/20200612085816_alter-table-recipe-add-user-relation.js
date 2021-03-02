const tableSourceName = 'recipe';
const tableTargetName = 'user';

exports.up = function (knex) {
   return knex.schema.alterTable(tableSourceName, (table) => {
      table.integer('user_id').notNullable().references('id').inTable(tableTargetName);
   });
};

exports.down = function (knex) {
   return knex.schema.alterTable(tableName, (table) => {
      table.dropColumn('user_id');
   });
};
