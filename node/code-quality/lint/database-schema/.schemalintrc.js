module.exports = {
   connection: {
      host: 'localhost',
      user: 'postgres',
      database: 'database',
      charset: 'utf8',
   },

   rules: {
      'name-casing': ['error', 'camel'],
      'name-inflection': ['error', 'plural'],
      'prefer-jsonb-to-json': ['error'],
      'prefer-text-to-varchar': ['error'],
   },

   schemas: [{ name: 'public' }],

   ignores: [
      { identifierPattern: 'public\\.knex_migrations.*', rulePattern: '.*' },
   ],
};
