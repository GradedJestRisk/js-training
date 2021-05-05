const crypto = require('crypto');
const {Parser} = require('node-sql-parser');
const removeNewline = require('newline-remove');
const parser = new Parser();

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
}

const registerEventsHandlers = ({ queries, knexMonitoring, knexMonitored}) => {

   knexMonitored.on('query', (query) => {
      const uid = query.__knexQueryUid;
      queries[uid] = {
         query,
         startTime: Date.now(),
         // I keep track of when a query is finished with a boolean instead of
         // presence of an end time. It makes the logic easier to read.
         finished: false,
      };
   })
      .on('query-response', async (response, query) => {
         const uid = query.__knexQueryUid;

         const queryText = normalizeString(query.sql);
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

module.exports = { registerDebugEventsHandlers, registerEventsHandlers}
