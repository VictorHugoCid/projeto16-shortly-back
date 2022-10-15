import express from 'express';
import cors from 'cors';
import { connection } from './database/db.js';

import authRouters from './routers/authRouters.js';
import urlRouters from './routers/urlRouters.js';
import othersRouters from './routers/othersRouters.js';

const server = express();
server.use(cors());
server.use(express.json());

server.use(authRouters);
server.use(urlRouters);
server.use(othersRouters);

connection.query('SELECT * FROM users').then(() => console.log('banco conectado')).catch(err => console.log(err))

server.listen(4000, () => {
    console.log('Magic happens on 4000')
})