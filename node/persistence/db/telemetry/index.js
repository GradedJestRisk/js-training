require('./tracer')('statement')

const knex = require('knex')({
   client: 'postgresql',
   connection: {
      host: 'localhost',
      user: 'postgres',
      database: 'database'
   }
});

const main = async () => {
   // const currentSpan = api.trace.getSpan(api.context.active())
   // currentSpan.addEvent('Added statement')
   await knex('statement').del();

   await knex('statement').insert({
      id: 1,
      text: 'select * from foo'
   });

   await knex('statement').insert({
      id: 2,
      text: 'select id from bar'
   });

   await knex.from('statement').select('text');

}

(() => {
   main();
   process.exit(0);
})()
