import { connection } from '../database/db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

async function signUp(req, res) {
    const { name, email, password, confirmPassword } = req.body

    if (password !== confirmPassword) {
        return res.status(422).send('As senhas não são iguais')
    }
    const hashPassword = bcrypt.hashSync(password, 10)
 

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
        
        const userSearch = await connection.query('SELECT * FROM users WHERE email = $1', [email])
        const user = userSearch.rows[0]
        
        const confirmPassword = await bcrypt.compare(password, user.password)

        if (!user || !confirmPassword) {
            return res.status(401).send('Usuário e/ou senha não encontrada')
        }
        
        // -----------------------------------------------------
        const tokenJWT = jwt.sign({ 
            id: user.id 
        }, 'KEY');        

        await connection.query('INSERT INTO sessions ("userId", token) values ($1, $2) ', [user.id, tokenJWT])

        res.status(200).send(tokenJWT)

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