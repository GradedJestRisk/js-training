// require('dotenv').config();
const { KnexTimeoutError } = require('knex/lib/util/timeout');
const TABLES = { foo: 'foo'}
const crypto = require('crypto');
const Boom = require('@hapi/boom')

const {knexMonitoring, knexMonitored} = require('../database/database-client');

const insertRoutes = async(routes)=>{
   await Promise.all(routes.map((route)=> {
      const routeText = `${route.method} ${route.path}`;
      const routeId = crypto.createHash('sha1').update(routeText).digest('hex');
      const query = `INSERT INTO route (id, text) VALUES ('${routeId}','${routeText}') ON CONFLICT ON CONSTRAINT route_pkey DO NOTHING;`;
      return knexMonitoring.raw(query);
   }));
}

const insertVersion = async(version)=>{
   const query = `INSERT INTO version (id) VALUES ('${version}') ON CONFLICT ON CONSTRAINT version_pkey DO NOTHING;`;
   await knexMonitoring.raw(query);
}
const createIndex = async()=>{
   const query = `CREATE INDEX on foo(id);`;
   await knexMonitored.raw(query);
}

const queryWithRequestId = ({requestId, query}) => {
   return `/*${requestId}*/${query}`
}

const insertSomeData = async ({requestId, knex, count}) => {
   const query = `INSERT INTO foo (id)
                   SELECT floor(random() * 100 + 1)::int
                   FROM generate_series( 1, ${count})`;

   await knex.raw(queryWithRequestId({query, requestId}));
}

const issueAFirstRowSelect = async ({requestId, knex}) => {
   //const query = 'SELECT * FROM foo LIMIT 1';
   // await knex.raw(queryWithRequestId({query, requestId}));
   await knex.select('*').from(TABLES.foo).limit(1).hintComment(requestId);
}
const issueAGroupQuery = async ({requestId, knex}) => {
   const query = 'SELECT id, COUNT(1) FROM foo GROUP BY id';
   await knex.raw(queryWithRequestId({query, requestId}));
}
const issueACartesianJoin = async ({requestId, knex}) => {

   try {

      const query = 'SELECT COUNT(1) FROM (SELECT f1.id, f2.id FROM foo f1, foo f2) t';
      await knex.raw(queryWithRequestId({query, requestId})).timeout(
         process.env.QUERY_TMEOUT_SECOND * 1000,
         {cancel: true});

   } catch (error) {
      if (!(error instanceof KnexTimeoutError)) {
         throw(error);
      } else {
         // const queryText = error.sql;
         console.log(`${error.sql} execution exceeded the maximum allowed time (${process.env.QUERY_TMEOUT_SECOND} s)`);
         throw Boom.gatewayTimeout();
      }
   }

}

const fakeAQuery = async ({requestId, knex, timeToWaitSeconds}) => {
   const query = `select pg_sleep('${timeToWaitSeconds}');`
   await knex.raw(queryWithRequestId({query, requestId}));
}

const removeAll = async ({requestId, knex}) => {
   const query = 'TRUNCATE TABLE foo';
   await knex.raw(queryWithRequestId({query, requestId}));
   // Doesn't work as hints are not properly inserted
   //   await knex(TABLES.foo).truncate().hintComment(correlationId);
}

module.exports = {insertRoutes, insertSomeData, issueAFirstRowSelect, issueAGroupQuery, issueACartesianJoin, fakeAQuery, removeAll, insertVersion, createIndex}

