import pg from 'pg';
import dotenv, { config } from 'dotenv';

dotenv; config()

const { Pool } = pg;

const connection = new Pool({
    connectionstring: process.env.DATABASE_URL,
});

export { connection }