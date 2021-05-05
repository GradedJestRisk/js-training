require('dotenv').config();
const {knexMonitoring, knexMonitored} = require('../database/database-client');
const repository = require('./repository');
const knexHandlers = require('./knexHandlers');

const queries = {};
knexHandlers.registerEventsHandlers({queries, knexMonitoring, knexMonitored});

const routes = [
   {
      method: 'POST',
      path: '/',
      handler: async function () {
         await repository.insertSomeData({knex: knexMonitored, count: 100});
         return 'Data loaded';
      }
   }, {
      method: 'GET',
      path: '/',
      handler: async function () {
         await repository.issueAFirstRowSelect(knexMonitored);
         await repository.issueAGroupQuery(knexMonitored);
         return 'Hello World!';
      }
   },
];

module.exports = routes;
