import pg from 'pg';
import { Pool } from 'pg';

export const pool = new Pool({
  user: 'postgres',
  password: 'homelib',
  host: 'localhost',
  port: 5432,
  database: 'home_lib',
});

export const runPgClient = async () => {
  const { Client } = pg;
  const client = new Client();
  await client.connect();

  const res = await client.query('SELECT $1::text as message', [
    'Hello world!',
  ]);
  console.log(res.rows[0].message); // Hello world!
  await client.end();
};
