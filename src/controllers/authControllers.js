import { connection } from '../database/db.js'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';
import { stripHtml } from 'string-strip-html';

async function signUp(req, res) {
    const { name, email, password } = req.body

    const hashPassword = bcrypt.hashSync(password, 10)

    // MIDDLEWARE - JOIS E VERIFICAR JÁ EXISTENCIA

    try {
        await connection.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [name, email, hashPassword])

        res.sendStatus(201)

    } catch (error) {
        console.error(error)
        res.sendStatus(500)

    }
}

async function signIn(req, res) {
    const { email, password } = req.body

    try {
        // -----------------------------------------------------
        if (!email || !password) {
            return res.status(422).send('Preencha todos os campos')
        }
        const token = uuidv4()
        // -----------------------------------------------------
        const userSearch = await connection.query('SELECT * FROM users WHERE email = $1', [email])
        const user = userSearch.rows[0]

        if (!user) {
            return res.status(401).send('esse usuário não existe')
        }
        // -----------------------------------------------------

        await connection.query('INSERT INTO sessions (id, token) values ($1, $2) ', [user.id, token])

        res.status(200).send(token)

    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }

}

export {
    signUp,
    signIn
}