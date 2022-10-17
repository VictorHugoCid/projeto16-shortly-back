

function validateSchema(schema) {

    return async function (req, res, next) {
        const validation = schema.validate(req.body, { abortEarly: false });

        if (validation.error) {
            const errors = validation.error.details.map(value => value.message);
            return res.status(422).send(errors)
        }

        next()
    }


}

export { validateSchema }