require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

const repository = require('./code/repository');
const knexHandlers = require('./code/knexHandlers')
const {knexMonitoring, knexMonitored} = require('./database/database-client');

(async () => {

   // const queries = {};
   // knexHandlers.registerDebugEventsHandlers(knexMonitored);
   //await repository.insertSomeData({knex: knexMonitored, count: 100});
   // await repository.issueACartesianJoin(knexMonitored);

   const correlationId = uuidv4();

   const insertQuery = `INSERT INTO correlation (id, text)
                        VALUES ('${correlationId}','script')`;

   await knexMonitoring.raw(insertQuery);

   const queries = {};
   knexHandlers.registerEventsHandlers({queries, knexMonitoring, knexMonitored});

   await repository.insertSomeData({ correlationId, knex: knexMonitored, count: 1000});
   await repository.issueAFirstRowSelect({correlationId, knex: knexMonitored});
   await repository.issueAGroupQuery({correlationId, knex: knexMonitored});

   await repository.insertSomeData({ correlationId, knex: knexMonitored, count: 100000});
   await repository.issueACartesianJoin({correlationId, knex : knexMonitored});
   //
   // await repository.insertSomeData({knex: knexMonitored, count: 100});
   // await repository.issueAFirstRowSelect(knexMonitored);
   // await repository.issueAGroupQuery(knexMonitored);
   // await repository.issueAGroupQuery(knexMonitored);
   // await repository.issueACartesianJoin(knexMonitored);
   //
   // await repository.insertSomeData({knex: knexMonitored, count: 10000});
   // await repository.issueAFirstRowSelect(knexMonitored);
   // await repository.issueAGroupQuery(knexMonitored);
   // await repository.issueACartesianJoin(knexMonitored);
   //
   // await repository.insertSomeData({knex: knexMonitored, count: 100000});
   // await repository.issueAFirstRowSelect(knexMonitored);
   // await repository.issueAGroupQuery(knexMonitored);
   // await repository.issueAGroupQuery(knexMonitored);
   // const timeToWaitSeconds = 2;
   // await fakeAQuery({knex: knexMonitored, timeToWaitSeconds});

   process.exit();
})()
