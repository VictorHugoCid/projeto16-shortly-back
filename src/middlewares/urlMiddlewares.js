import { connection } from '../database/db.js';


async function validateUrl(req, res, next) {
    const { url } = req.body
    const token = req.headers.authorization?.replace('Bearer ', '')

    const httpRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

    if (!httpRegex.test(url)) {
        return res.status(422).send('invalid url')
    }

    try {
        // validate session
        const sessionSearch = await connection.query('SELECT * FROM sessions WHERE token = $1', [token])
        const session = sessionSearch.rows[0]
        if (!session) {
            return res.status(401).send('o usuário não está logado')
        }

        // verificar se a url já foi criada
        const urlSearch = await connection.query('SELECT * FROM urls WHERE url = $1 AND "userId" = $2', [url, session.userId])
        const urlInput = urlSearch.rows[0]

        if (urlInput) {
            return res.status(409).send('essa url já foi adicionada por esse usuário')
        }

        next()
    } catch (error) {
        console.error(error)
        res.sendStatus(500)

    }
}

export {
    validateUrl,
}