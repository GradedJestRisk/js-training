const TABLE_NAME = 'authorizedUsers'

exports.up = (knex) => {

   function table (t) {

      t.increments().primary()
      t.text('firstName').notNullable()
      t.text('lastName').notNullable()
      t.text('email').nullable()
      t.text('login').notNullable()
      t.text('password').notNullable()
      t.dateTime('createdAt').notNullable().defaultTo(knex.fn.now())
      t.dateTime('updatedAt').notNullable().defaultTo(knex.fn.now())
   }

   return knex.schema
      .createTable(TABLE_NAME, table)
}

exports.down = (knex) => {

   return knex.schema
      .dropTable(TABLE_NAME)
}
