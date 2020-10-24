const { Client } = require('pg');

const client = new Client({
    database: 'cooking_db',
    user:     'postgres',
    port:      7432
});

client.connect();

module.exports = client;