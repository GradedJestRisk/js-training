const knex = require('./knex/knex.js');

knex.from('recipe').select('name', 'serving')
    .then((rows) => {
        const recipeCount = rows.length;
        console.log(`Here are the ${ recipeCount } recipes:`);
        for (row of rows) {
            console.log(` * ${ row['name']} serves ${ row['serving']} people`);
        }
    })
    .catch((err) => { console.log( err); throw err })
    .finally(() => {
        knex.destroy();
    });
