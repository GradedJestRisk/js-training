require('dotenv').config();

const repository = require('./code/repository');
const knexHandlers = require('./code/knexHandlers')
const {knexMonitoring, knexMonitored} = require('./database/database-client');

(async () => {

   // const queries = {};
   // knexHandlers.registerDebugEventsHandlers(knexMonitored);
   //await repository.insertSomeData({knex: knexMonitored, count: 100});
   // await repository.issueACartesianJoin(knexMonitored);

   const queries = {};
   await repository.insertSomeData({knex: knexMonitored, count: 100000});
   knexHandlers.registerEventsHandlers({queries, knexMonitoring, knexMonitored});
   await repository.issueACartesianJoin(knexMonitored);
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
