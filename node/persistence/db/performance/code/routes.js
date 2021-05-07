require('dotenv').config();
const Joi = require('joi');

const {knexMonitoring, knexMonitored} = require('../database/database-client');
const correlation = require('./correlation');
const repository = require('./repository');
const knexHandlers = require('./knexHandlers');

const queries = {};
knexHandlers.registerEventsHandlers({queries, knexMonitoring, knexMonitored});

const routes = [
   {
      method: 'POST',
      path: '/foo',
      config: {
         description: 'Insert data (according to payload)',
         validate: {
            payload: Joi.object({
               count: Joi.number().integer().min(1).required(),
            }),
         },
      },
      handler: async function (request) {
         const count = request.payload.count;
         await repository.insertSomeData({knex: knexMonitored, count: count});
         return `${count} data created`;
      }
   },
   {
      method: 'DELETE',
      path: '/foo',
      config: {
         description: 'Remove all data',
      },
      handler: async function () {
         await repository.removeAll(knexMonitored);
         return 'Done';
      }
   }, {
      method: 'GET',
      path: '/foo/short-query',
      config: {
         description: 'Execute a SELECT query (brief)',
         validate: {
            headers: Joi.object({
               'x-correlation-id': Joi.string().required()
               // 'foo': Joi.string().required()
            }),
            options: {
               allowUnknown: true
            }
         }
      },
      handler: async function (request) {

         const correlationId = request.headers['x-correlation-id'];
         await correlation.insertCorrelation({knexMonitoring, correlationId});

         await repository.issueAFirstRowSelect({
            correlationId,
            knex: knexMonitored
         });
         await repository.issueAGroupQuery({
            correlationId,
            knex: knexMonitored
         });
         return 'Done';
      }
   },
   {
      method: 'GET',
      path: '/foo/long-query',
      config: {
         description: 'Execute a SELECT query (long)',
      },
      handler: async function () {
         await repository.issueACartesianJoin(knexMonitored);
         return 'Done';
      }
   },
];

module.exports = routes;
