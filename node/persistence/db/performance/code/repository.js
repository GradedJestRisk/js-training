require('dotenv').config();
const { KnexTimeoutError } = require('knex/lib/util/timeout');

const queryWithCorrelationId = ({correlationId, query}) => {
   return `/*${correlationId}*/${query}`
}

const insertSomeData = async ({correlationId, knex, count}) => {
   const query = `INSERT INTO foo (id)
                   SELECT floor(random() * 100 + 1)::int
                   FROM generate_series( 1, ${count})`;

   await knex.raw(queryWithCorrelationId({query, correlationId}));
}

const issueAFirstRowSelect = async ({correlationId, knex}) => {
   const query = 'SELECT * FROM foo LIMIT 1';
   await knex.raw(queryWithCorrelationId({query, correlationId}));
}
const issueAGroupQuery = async ({correlationId, knex}) => {
   const query = 'SELECT id, COUNT(1) FROM foo GROUP BY id';
   await knex.raw(queryWithCorrelationId({query, correlationId}));
}
const issueACartesianJoin = async ({correlationId, knex}) => {

   try {

      const query = 'SELECT COUNT(1) FROM (SELECT f1.id, f2.id FROM foo f1, foo f2) t';
      await knex.raw(queryWithCorrelationId({query, correlationId})).timeout(
         process.env.QUERY_TMEOUT_SECOND * 1000,
         {cancel: true});

   } catch (error) {
      if (!(error instanceof KnexTimeoutError)) {
         throw(error);
      } else {
         // const queryText = error.sql;
         // console.log(`${queryText} execution exceeded the maximum allowed time (${process.env.QUERY_TMEOUT_SECOND} s)`);
      }
   }

}

const fakeAQuery = async ({correlationId, knex, timeToWaitSeconds}) => {
   const query = `select pg_sleep('${timeToWaitSeconds}');`
   await knex.raw(queryWithCorrelationId({query, correlationId}));
}

const removeAll = async ({correlationId, knex}) => {
   const query = 'TRUNCATE TABLE foo';
   await knex.raw(queryWithCorrelationId({query, correlationId}));
}

module.exports = {insertSomeData, issueAFirstRowSelect, issueAGroupQuery, issueACartesianJoin, fakeAQuery, removeAll}

