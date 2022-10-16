import { response } from 'express';
import { signInSchema, signUpSchema } from '../schemas/authSchema.js';


async function validateSignUp(req, res, next) {

    const validation = signUpSchema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        const errors = validation.error.details.map(value => value.message);
        return res.status(401).send(errors)
    }
    next()
}

async function validateSignIn(req, res, next) {
    const { email, password } = req.body
    const validation = signInSchema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        const errors = validation.error.details.map(value => value.message);
        return res.status(401).send(errors)
    }

    try {
        // validate user
        const userSearch = await connection.query('SELECT * FROM users WHERE email = $1', [email])
        const user = userSearch.rows[0]

        const confirmPassword = await bcrypt.compare(password, user.password)

        if (!user || !confirmPassword) {
            return res.status(401).send('Usuário e/ou senha não encontrada')
        }
        response.locals.user = user

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