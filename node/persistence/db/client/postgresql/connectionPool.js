const { Pool } = require('pg')

const pool = new Pool({
   database: 'database',
   user: 'postgres',
   port: 5432,
   max: 20,
   idleTimeoutMillis: 30000,
   connectionTimeoutMillis: 2000,
})

module.exports = {
   query: (text, params) => pool.query(text, params),
}
