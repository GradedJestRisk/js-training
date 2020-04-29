const knex = require('./knex/knex.js');

knex.from('recipe').select('name')
    .then((rows) => {
        for (row of rows) {
            console.log(` Recipe ${row['name']} }`);
        }
    })
    .catch((err) => { console.log( err); throw err })
    .finally(() => {
        knex.destroy();
    });
