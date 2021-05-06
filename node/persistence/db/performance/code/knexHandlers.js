const crypto = require('crypto');
const removeNewline = require('newline-remove');
const sqlParser = require('./sqlParser');

const normalizeString = (string) => {
   const stringWithoutNewLine = removeNewline(string);
   const stringWithoutConsecutiveSpaces = stringWithoutNewLine.replace(/\s+/g, ' ').trim()
   return stringWithoutConsecutiveSpaces
}

const registerDebugEventsHandlers = (knex) => {
   knex.on('query', (query) => {
      console.log(`Query submitted: ${query.sql} (id: ${query.__knexQueryUid})`);
   })
   knex.on('query-response', (response, query) => {
      console.log(`Query finished: ${query.sql} (id: ${query.__knexQueryUid})`);
   })
   knex.on('query-error', (response, query) => {
      console.log(`Query error: ${query.sql} (id: ${query.__knexQueryUid})`);
   })
}

const registerEventsHandlers = ({ queries, knexMonitoring, knexMonitored}) => {

   knexMonitored.on('query', (query) => {
      const queryExecutionId = query.__knexQueryUid;
      queries[queryExecutionId] = {
         startTime: Date.now()
      };
   });

   knexMonitored.on('query-response', async (response, query) => {

         const queryExecutionId = query.__knexQueryUid;
         const queryDuration = Date.now() - queries[queryExecutionId].startTime;

         const queryText = normalizeString(query.sql);
         const queryHash = crypto.createHash('sha1').update(queryText).digest('hex');
         const queryType = sqlParser.getQueryType(queryText);

         const insertQuery = `INSERT INTO query (id, type, text)
                              VALUES ('${queryHash}','${queryType}', '${queryText}')
                              ON CONFLICT ON CONSTRAINT query_pkey DO NOTHING;`;

         await knexMonitoring.raw(insertQuery);

         const insertQueryExecution = `INSERT INTO query_execution (id, query_id, start_date, duration)
                                       VALUES ('${queryExecutionId}', '${queryHash}',  ${queries[queryExecutionId].startTime} ,${queryDuration})`;
         await knexMonitoring.raw(insertQueryExecution);
         queries[queryExecutionId] = null;
      })

   knexMonitored.on('query-error', (response, query) => {
      const queryExecutionId = query.__knexQueryUid;
      queries[queryExecutionId] = null;
   });
}

module.exports = { registerDebugEventsHandlers, registerEventsHandlers}
