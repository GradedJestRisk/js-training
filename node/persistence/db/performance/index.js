require('dotenv').config();
const crypto = require('crypto');
const {Parser} = require('node-sql-parser');
const removeNewline = require('newline-remove');

const parser = new Parser();


const knexMonitoring = require('knex')({
   client: 'pg',
   connection: {
      host: process.env.MONITORING_DATABASE_HOST,
      port: process.env.MONITORING_DATABASE_PORT,
      user: process.env.MONITORING_DATABASE_USERNAME,
      database: process.env.MONITORING_DATABASE_INSTANCE_NAME
   }
});

const knexMonitored = require('knex')({
   client: 'pg',
   connection: {
      host: process.env.MONITORED_DATABASE_HOST,
      port: process.env.MONITORED_DATABASE_PORT,
      user: process.env.MONITORED_DATABASE_USERNAME,
      database: process.env.MONITORED_DATABASE_INSTANCE_NAME
   }
});
const queries = {};
let count = 0;

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
   await knex.raw('SELECT COUNT(1) FROM (SELECT f1.id, f2.id FROM foo f1, foo f2) t');
}

const fakeAQuery = async ({knex, timeToWaitSeconds}) => {
   await knex.raw(`select pg_sleep('${timeToWaitSeconds}');`);
}

const registerDebugEventsHandlers = (knex) => {
   knex.on('query', (query) => {
      console.log(`Query submitted: ${query.sql} (id: ${query.__knexQueryUid})`);
   })
   knex.on('query-response', (response, query) => {
      console.log(`Query finished: ${query.sql} (id: ${query.__knexQueryUid})`);
   })
}

const registerEventsHandlers = ({knexMonitoring, knexMonitored}) => {

   knexMonitored.on('query', (query) => {
      const uid = query.__knexQueryUid;
      queries[uid] = {
         position: count,
         query,
         startTime: Date.now(),
         // I keep track of when a query is finished with a boolean instead of
         // presence of an end time. It makes the logic easier to read.
         finished: false,
      };
      count = count + 1;
   })
      .on('query-response', async (response, query) => {
         const uid = query.__knexQueryUid;

         const queryText = removeNewline(query.sql);
         const queryHash = crypto.createHash('sha1').update(queryText).digest('hex');
         let queryType = 'UNKNOWN';
         try {
            const queryAST = parser.astify(queryText);
            queryType = queryAST.type;
         } catch (error) {
            //console.log(`${queryText} cannot be parsed`)
         }
         const insertQuery = `INSERT INTO query (id, type, text) VALUES ('${queryHash}','${queryType}', '${queryText}') ON CONFLICT ON CONSTRAINT query_pkey DO NOTHING;`;
         await knexMonitoring.raw(insertQuery);

         const queryDuration = Date.now() - queries[uid].startTime;

         const insertQueryExecution = `INSERT INTO query_execution (id, start_date, duration) VALUES ('${queryHash}', ${queries[uid].startTime} ,${queryDuration})`;
         await knexMonitoring.raw(insertQueryExecution);
         queries[uid] = null;
      })
}



(async () => {

   //registerDebugEventsHandlers(knexMonitored);
   registerEventsHandlers({knexMonitoring, knexMonitored});

   await insertSomeData({knex: knexMonitored, count: 10000});
   await issueAFirstRowSelect(knexMonitored);
   await issueAGroupQuery(knexMonitored);
   await issueACartesianJoin(knexMonitored);
   await issueACartesianJoin(knexMonitored);

   await insertSomeData({knex: knexMonitored, count: 100000});
   await issueAGroupQuery(knexMonitored);
   // const timeToWaitSeconds = 2;
   // await fakeAQuery({knex: knexMonitored, timeToWaitSeconds});

   process.exit();
})()
