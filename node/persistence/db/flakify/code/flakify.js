const flakify = (knex) => {

   // https://knexjs.org/#Interfaces-Events
   knex.on('start', function (builder) {

      if (builder._method === undefined) {
         // raw query
         return;
      } else {

         if (builder._method === 'select') {
            if (builder._single.table === 'foo') {
               builder._single.table = 'foo_shuffled AS foo';
            } else if(Object.values(builder._single.table)[0] === 'foo'){
               const keyName =  Object.keys(builder._single.table).find(key => builder._single.table[key] === 'foo')
               builder._single.table[keyName] = 'foo_shuffled';
            }else {
               if (builder._statements) {

                  builder._statements.map((statement) => {
                     if (statement.table) {
                        if (statement.table === 'foo') {
                           statement.table = 'foo_shuffled AS foo'
                        }
                     } else if (statement.grouping) {
                        if (statement.grouping === 'where' && statement.value._single.table === 'foo') {
                           statement.value._single.table = 'foo_shuffled AS foo'
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
