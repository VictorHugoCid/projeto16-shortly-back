import { connection } from '../database/db.js'
import { nanoid } from 'nanoid'
import jwt from 'jsonwebtoken';

async function getUrlById(req, res) {
    const { id } = req.params

    try {
        const urlSearch = await connection.query('SELECT * FROM urls WHERE id = $1', [id])
        const url = urlSearch.rows[0]
        if (!url) {
            return res.status(404).send('esss url não existe')
        }
        res.status(200).send(url)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)

    }
}

async function createUrl(req, res) {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const { url } = req.body

    const verifyToken = jwt.verify(token, 'KEY')
    
    if (!verifyToken) {
        return res.status(401).send('invalid token')
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

        // criar shortUrl
        const shortUrl = nanoid();

        // insert
        await connection.query('INSERT INTO urls ("userId", url, "shortUrl", "visitCount") VALUES ($1, $2, $3, $4)', [session.userId, url, shortUrl, 0])


        res.status(200).send(shortUrl)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)

    }
}

async function redirectUrl(req, res) {
    const { shortUrl } = req.params;

    try {
        const shortUrlSearch = await connection.query('SELECT * FROM urls WHERE "shortUrl" = $1', [shortUrl])

        if (!shortUrlSearch.rows[0]) {
            return res.sendStatus(404)
        }

        // aumentar 1 na contagem de visitas do link (Update)
        let visitCount = (shortUrlSearch.rows[0]).visitCount
        visitCount++

        const id = (shortUrlSearch.rows[0]).id

        await connection.query('UPDATE urls SET "visitCount" = $1 WHERE id = $2', [visitCount++, id])

        const url = (shortUrlSearch.rows[0]).url
        res.redirect(url)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)

    }
}

async function deleteUrl(req, res) {
    const urlId = req.params.id
    const token = req.headers.authorization?.replace('Bearer ', '')

    const verifyToken = jwt.verify(token, 'KEY')
    
    if (!verifyToken) {
        return res.status(401).send('invalid token')
    }

    try {
        // session verification
        const sessionSearch = await connection.query('SELECT * FROM sessions WHERE token = $1', [token])
        const session = sessionSearch.rows[0]
        if (!session) {
            return res.status(401).send('o usuário não está logado')
        }
        const userSearch = await connection.query('SELECT * FROM users WHERE id = $1', [session.userId])
        const user = userSearch.rows[0]

        // url verification
        const urlSearch = await connection.query('SELECT * FROM urls WHERE id = $1', [urlId])
        const url = urlSearch.rows[0]
        // 
        console.log(urlSearch.rows)
        if (!url) {
            return res.status(404).send('essa url não existe')
        }

        if (url.userId !== user.id) {
            return res.status(401).send('essa url não pertence a esse usuário')
        }

        // delete
        await connection.query('DELETE FROM urls WHERE id = $1', [urlId])

        res.sendStatus(204)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)

    }
}


export {
    getUrlById,
    createUrl,
    redirectUrl,
    deleteUrl,

}