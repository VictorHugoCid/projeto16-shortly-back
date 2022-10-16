import jwt from 'jsonwebtoken';
import { connection } from '../database/db.js';
import dotenv from 'dotenv';
dotenv.config()


async function validateSession(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '')

    const verifyToken = jwt.verify(token, process.env.TOKEN_SECRET)

    if (!verifyToken) {
        return res.status(401).send('invalid token')
    }

    try {
        // validate session
        const sessionSearch = await connection.query('SELECT * FROM sessions WHERE token = $1', [token])
        const session = sessionSearch.rows[0]
        if (!session) {
            return res.status(401).send('o usuário não está logado')
        }

        res.locals.id = verifyToken.id
        next()
    } catch (error) {
        console.error(error)
        res.sendStatus(500)

    }
}

export {
    validateSession,
}