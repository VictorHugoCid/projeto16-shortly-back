

function validateSchema(schema) {

    const validation = schema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        const errors = validation.error.details.map(value => value.message);
        return res.status(401).send(errors)
    }

}

export { validateSchema }