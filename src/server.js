import express from 'express';
import cors from 'cors';
import {connection} from './database/db.js';

import authRouters from './routers/authRouters.js';

const server = express();
server.use(cors());
server.use(express.json());

server.use(authRouters);

connection.query('SELECT * FROM users').then(()=> console.log('banco conectado')).catch(err=> console.log(err))

server.listen(4000, ()=>{
    console.log('Magic happens on 4000')
})