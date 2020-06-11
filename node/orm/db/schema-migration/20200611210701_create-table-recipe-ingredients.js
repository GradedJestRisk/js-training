const tableName = 'recipes_ingredients';
exports.up = function(knex) {
    return knex.schema.createTable(tableName, table => {
        table.integer('recipe_id').notNullable().references('id').inTable('recipe');
        table.integer('ingredient_id').notNullable().references('id').inTable('ingredient');
        table.integer('quantity').notNullable();
        table.string('unit').notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable(tableName);
};
