// https://node-postgres.com/features/pooling
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
   host: 'localhost',
   port: process.env.POSTGRESQL_EXPOSED_PORT,
   database: process.env.POSTGRESQL_DATABASE_NAME,
   user: process.env.POSTGRESQL_USER_NAME,
   password: process.env.POSTGRESQL_USER_PASSWORD,
   application_name: 'concurrency',
   max: process.env.MAX_CONNECTIONS,
   idleTimeoutMillis: 30000,
   connectionTimeoutMillis: 0,
});

// await pool.query('SELECT pg_sleep(1)')
// await pool.query('SELECT pg_sleep(2)')
// await pool.query('SELECT pg_sleep(3)')
// await pool.query('SELECT pg_sleep(4)')

await Promise.all([
   pool.query('SELECT pg_sleep(2)'),
   pool.query('SELECT pg_sleep(4)'),
   pool.query('SELECT pg_sleep(6)'),
]);

console.log('all queries executed !');
await pool.end();
