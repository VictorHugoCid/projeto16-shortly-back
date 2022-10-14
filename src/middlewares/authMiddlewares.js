import joi from 'joi';

import { signInSchema, signUpSchema } from '../schemas/authSchema.js';

async function validateSignUp(req, res, next) {


    const validation = signUpSchema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        const errors = validation.error.details.map(value => value.message);
        return res.status(401).send(errors)
    }


    next()
    try {

    } catch (error) {
        console.error(error)
        res.sendStatus(500)

    }
}

async function validateSignIn(req, res, next) {


    const validation = signInSchema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        const errors = validation.error.details.map(value => value.message);
        return res.status(401).send(errors)
    }

    next()
    try {

    } catch (error) {
        console.error(error)
        res.sendStatus(500)

    }
}

export {
    validateSignUp,
    validateSignIn,    
}