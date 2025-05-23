import { Client } from "pg";

async function query(queryObject) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  });
  await client.connect();

  try {
    const res = await client.query(queryObject);
    return res;
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

export default {
  query,
};
