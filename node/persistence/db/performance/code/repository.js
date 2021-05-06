require('dotenv').config();
const KnexTimeoutError = require('knex/lib/util/timeout');

const insertSomeData = async ({knex, count}) => {
   // await knex.raw(`INSERT INTO foo DEFAULT VALUES;`);
   await knex.raw(`INSERT INTO foo (id)
                   SELECT floor(random() * 100 + 1)::int
                   FROM generate_series( 1, ${count})`);
}

const issueAFirstRowSelect = async (knex) => {
   await knex.raw('SELECT * FROM foo LIMIT 1');
}
const issueAGroupQuery = async (knex) => {
   await knex.raw('SELECT id, COUNT(1) FROM foo GROUP BY id');
}
const issueACartesianJoin = async (knex) => {

   try {

      const query = 'SELECT COUNT(1) FROM (SELECT f1.id, f2.id FROM foo f1, foo f2) t';
      await knex.raw(query).timeout(
         process.env.QUERY_TMEOUT_SECOND * 1000,
         {cancel: true});

   } catch (error) {
      if (!(error instanceof KnexTimeoutError)) {
         throw(error);
      }
      // } else {
      //    const queryText = error.sql;
      //    console.log(`${queryText} execution exceeded the maximum allowed time (${process.env.QUERY_TMEOUT_SECOND} s)`);
      // }
   }

}

const fakeAQuery = async ({knex, timeToWaitSeconds}) => {
   await knex.raw(`select pg_sleep('${timeToWaitSeconds}');`);
}

const removeAll = async (knex) => {
   await knex.raw(`TRUNCATE TABLE foo`);
}

module.exports = {insertSomeData, issueAFirstRowSelect, issueAGroupQuery, issueACartesianJoin, fakeAQuery, removeAll}

