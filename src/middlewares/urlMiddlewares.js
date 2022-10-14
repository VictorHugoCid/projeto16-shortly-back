
async function validateUrl(req, res, next) {
    const {url} = req.body

    const httpRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

    if (!httpRegex.test(url)) {
        return res.status(422).send('invalid url')
    }

    try {



        next()
    } catch (error) {
        console.error(error)
        res.sendStatus(500)

    }
}

export {
    validateUrl,
}