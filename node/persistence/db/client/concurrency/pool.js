// https://node-postgres.com/features/pooling
import pg from 'pg'
const { Pool } = pg

const pool = new Pool({
   host: 'localhost',
   port: 5432,
   database: 'postgres',
   user: 'username',
   password: 'password123',
   application_name: 'concurrency',
   max: 3,
   idleTimeoutMillis: 30000,
   connectionTimeoutMillis: 0,
})

// await pool.query('SELECT pg_sleep(1)')
// await pool.query('SELECT pg_sleep(2)')
// await pool.query('SELECT pg_sleep(3)')
// await pool.query('SELECT pg_sleep(4)')

await Promise.all([
   pool.query('SELECT pg_sleep(10)'),
   pool.query('SELECT pg_sleep(11)'),
   pool.query('SELECT pg_sleep(12)')
]);

console.log("all queries executed !");
await pool.end();
