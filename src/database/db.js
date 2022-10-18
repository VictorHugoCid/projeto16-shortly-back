import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config()

const { Pool } = pg;

const connection = new Pool({
    connectionString: process.env.HEROKU_POSTGRESQL_PURPLE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

export { connection }
