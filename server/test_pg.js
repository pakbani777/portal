const { Client } = require('pg');
const client = new Client({
  host: 'db.bodfmgacldijewceqymz.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'Pakbani0721'
});

async function test() {
  try {
    await client.connect();
    const res = await client.query('SELECT NOW()');
    console.log('Connected via Postgres:', res.rows[0]);
  } catch (err) {
    console.error('Connection error:', err);
  } finally {
    await client.end();
  }
}
test();
