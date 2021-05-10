require('dotenv').config();
const Joi = require('joi');
const repository = require('./repository');
const knexHandlers = require('./knexHandlers');
const {knexMonitoring, knexMonitored} = require('../database/database-client');

const queries = {};
knexHandlers.registerEventsHandlers({queries, knexMonitoring, knexMonitored});

const routes = [
   {
      method: 'POST',
      path: '/foo',
      config: {
         description: 'Insert data (according to payload)',
         validate: {
            headers: Joi.object({
               'x-correlation-id': Joi.string().required()
            }),
            payload: Joi.object({
               count: Joi.number().integer().min(1).required(),
            }),
            options: {
               allowUnknown: true
            }
         },
      },
      handler: async function (request) {
         const count = request.payload.count;
         await repository.insertSomeData({
            knex: knexMonitored,
            requestId: request.requestId,
            count: count
         });
         return `${count} data created`;
      }
   },
   {
      method: 'DELETE',
      path: '/foo',
      config: {
         description: 'Remove all data',
         validate: {
            headers: Joi.object({
               'x-correlation-id': Joi.string().default(0)
            }),
            options: {
               allowUnknown: true
            }
         }
      },
      handler: async function (request) {
         await repository.removeAll({
            knex: knexMonitored,
            requestId: request.requestId
         });
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
            }),
            options: {
               allowUnknown: true
            }
         }
      },
      handler: async function (request) {

         await repository.issueAFirstRowSelect({
            requestId: request.requestId,
            knex: knexMonitored
         });

         await repository.issueAGroupQuery({
            requestId: request.requestId,
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
         validate: {
            headers: Joi.object({
               'x-correlation-id': Joi.string().required()
            }),
            options: {
               allowUnknown: true
            }
         }
      },
      handler: async function (request) {
         await repository.issueACartesianJoin({
            knex: knexMonitored,
            requestId: request.requestId
         });
         return 'Done';
      }
   },
];

module.exports = routes;
