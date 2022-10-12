import { connection } from '../database/db.js'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';
import { stripHtml } from 'string-strip-html';

async function signUp(req, res) {
    const { name, email, password, confirmPassword } = req.body

    if (password !== confirmPassword) {
        return res.status(422).send('As senhas não são iguais')
    }
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

        await connection.query('INSERT INTO sessions ("userId", token) values ($1, $2) ', [user.id, token])
        // 13d411ad-1a7f-4a40-87a7-ddb88dcc58c7

        res.status(200).send(token)

    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }

}

async function logOut(req, res) {
    const token = req.headers.authorization?.replace('Bearer ', '')

    try {
        const sessionSearch = await connection.query('SELECT * FROM sessions WHERE token = $1', [token])
        const session = sessionSearch.rows[0]
        if(!session){
            return res.status(404).send('o usuário não está mais logado')
        }

        await connection.query('DELETE FROM sessions WHERE id = $1',[session.id])

        res.status(200).send('logOut feito com sucesso')
    } catch (error) {
        console.error(error)
        res.sendStatus(500)

    }

}

export {
    signUp,
    signIn,
    logOut
}