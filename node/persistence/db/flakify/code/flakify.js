const tables = ['foo','foobar']
const shuffledViewPrefix = '_shuffled';

const flakify = (knex) => {

   // https://knexjs.org/#Interfaces-Events
   knex.on('start', function (builder) {

      if (builder._method === undefined) {
         // raw query
         return;
      } else {

         if (builder._method === 'select') {
            if (tables.includes(builder._single.table)) {
               builder._single.table = `${builder._single.table}${shuffledViewPrefix} AS ${builder._single.table}`;
            } else if(tables.includes(Object.values(builder._single.table)[0])){
               const keyName =  Object.keys(builder._single.table).find(key => tables.includes(builder._single.table[key]));
               builder._single.table[keyName] = `${builder._single.table[keyName]}${shuffledViewPrefix}`;
            }else {
               if (builder._statements) {
                  builder._statements.map((statement) => {
                     if (statement.table) {
                        if (tables.includes(statement.table)) {
                           statement.table = `${statement.table}${shuffledViewPrefix} AS ${statement.table}`;
                        }
                     } else if (statement.grouping) {
                        if (statement.grouping === 'where' && tables.includes(statement.value._single.table)) {
                           statement.value._single.table = `${statement.value._single.table}${shuffledViewPrefix} AS ${statement.value._single.table}`;
                        }
                     }
                  })
               }
            }
         }
      }
   });
}

module.exports = {flakify };
