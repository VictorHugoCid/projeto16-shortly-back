import joi from 'joi';

const signUpSchema = joi.object({
    name: joi.string().required().min(1),
    email: joi.string().email().required().min(1),
    password: joi.string().required().min(5),
    confirmPassword: joi.string().required().min(5)
})

const signInSchema = joi.object({
    email: joi.string().email().required().min(1),
    password: joi.string().required().min(5),
})

export {
    signUpSchema,
    signInSchema
}