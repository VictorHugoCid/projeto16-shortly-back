import {connection} from '../database/db.js'
import bcrypt from 'bcrypt'

async function validateSignUp(req, res, next) {
    console.log('passou validateSignUp')
    
    const {email} = req.body;
    

    try {
        const userSearch = await connection.query('SELECT * FROM users WHERE email = $1', [email])
        
        const user = userSearch.rows[0]

        if(user){
            return res.status(409).send("Este email já está sendo utilizado")
        }

        res.locals.user = user
        next()
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
    next()
}

async function validateSignIn(req, res, next) {
    const { email, password } = req.body

    try {
        // validate user
        const userSearch = await connection.query('SELECT * FROM users WHERE email = $1', [email])
        const user = userSearch.rows[0]

        const confirmPassword = await bcrypt.compare(password, user.password)

        if (!user || !confirmPassword) {
            return res.status(401).send('Usuário e/ou senha não encontrada')
        }

        res.locals.user = user
        next()
    } catch (error) {
        console.error(error)
        res.sendStatus(500)

    }
}

export {
    validateSignUp,
    validateSignIn,
}