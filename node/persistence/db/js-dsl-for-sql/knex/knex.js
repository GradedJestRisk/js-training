const environment = process.env.ENVIRONMENT || 'development'
const config = require('../knexfile.js')[environment];

const knex = require('knex')(config);

// Log SQL queries using monkey-patching
// From https://github.com/bookshelf/bookshelf/issues/1319#issuecomment-247261588
const knexClient = require('knex/lib/client');
const origQuery = knexClient.prototype.query;
knexClient.prototype.query = function (connection, obj) {
   // console.log(`DEBUG:  Method ${obj.method} Text ${obj.sql} Binding ${obj.bindings}`);
   return origQuery.apply(this, arguments);
};

knex.on('start', async (response, query) => {
   console.log('start event in knex');
});


knex.on('query', (query) => {
   console.log('query event in knex');
   // if (query.sql === 'select "recipe".* from "recipe" where "id" = ? and "correlation" = ? limit ?'){
   //    const correlationId = query.bindings[1];
   //    query.sql = `/*correlation=${correlationId}*/ select "recipe".* from "recipe" where "id" = ? limit ?`;
   //    query.bindings[1] = query.bindings[2];
   //    delete query.bindings[2];
   // }
});

knex.on('query-response', async (response, query) => {
   console.log('query-response event in knex');
});


// npm install --legacy-peer-deps  knex-hooks
// const knexHooks = require('knex-hooks');
//
// knexHooks(knex);
//
// knex.addHook('before', 'select', 'foo', (when, method, table, params) => {
//    delete params.query._statements[2];
//    console.log('Correlation removed from query')
// });


module.exports = knex;
