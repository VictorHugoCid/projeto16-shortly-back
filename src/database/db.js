import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config()

const { Pool } = pg;

const connection = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '123456',
    database: 'shortlyapi',
});

// const connection = new Pool({
//     connectionstring: process.env.DATABASE_URL,
// });

export { connection }




// DO
// $$
// BEGIN
//   IF NOT EXISTS (
//     SELECT FROM pg_catalog.pg_roles WHERE rolname='bootcamp_role'
//   ) THEN
//     CREATE ROLE bootcamp_role WITH SUPERUSER CREATEDB CREATEROLE LOGIN ENCRYPTED PASSWORD 'senha_super_hiper_ultra_secreta_do_role_do_bootcamp';
//   END IF;
// END
// $$;