import { connection } from '../database/db.js'
import { nanoid } from 'nanoid'

// model.id = nanoid() //=> "V1StGXR8_Z5jdHi6B-myT"


async function listUrl(req, res) {
    const { id } = req.params

    try {
        const urlSearch = db.connection.query('SELECT * FROM ulrs WHERE id = $1', [id])
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
    const { token } = req.headers.authorization?.replace('Bearer ', '')
    const { url } = req.body

    if (!token) {
        return res.status(401).send('invalid token')
    }
    const httpRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

    if (!httpRegex.test(url)) {
        return res.status(422).send('invalid url')
    }

    try {
        const sessionSearch = await db.connection.query('SELECT * FROM sessions WHERE token = $1', [token])
        const session = sessionSearch.rows[0]
        if (!session) {
            return res.status(401).send('o usuário não está logado')
        }

        // criar shortUrl
        const shortUrl = nanoid();

        // insert
        await db.connection.query('INSERT INTO urls ("userId", url, "shortUrl") VALUES ($1, $2, $3)', [session.userId, url, shortUrl])



        res.senStatus(201)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)

    }
}

async function redirectUrl(req, res) {
    const { shortUrl } = req.params;

    try {
        const shortUrlSearch = db.connection.query('SELECT * FROM urls WHERE "shortUrl" = $1', [shortUrl])

        if (!shortUrlSearch.rows[0]) {
            return res.sendStatus(404)
        }
        // aumentar 1 na contagem de visitas do link (Update)
        const id = (shortUrlSearch.rows[0]).id
        const visitCount = (shortUrlSearch.rows[0]).visitCount


        await db.connection.query('UPDATE urls SET "visitCount" = $1 WHERE id = $2', [visitCount++, id])

        res.redirect(shortUrl)

    } catch (error) {
        console.error(error)
        res.sendStatus(500)

    }
}

async function deleteUrl(req, res) {
    const urlId = req.params.id
    const { token } = req.headers.authorization?.replace('Bearer ', '')


    try {
        // session verification
        const sessionSearch = await db.connection.query('SELECT * FROM sessions WHERE token = $1', [token])
        const session = sessionSearch.rows[0]
        if (!session) {
            return res.status(401).send('o usuário não está logado')
        }
        const userSearch = await db.connection.query('SELECT * FROM users WHERE id = $1', [session.userId])
        const user = userSearch.rwos[0]
        // 

        // url verification
        const urlSearch = await db.connection.query('SELECT * FROM urls WHERE id = $1', [urlId])
        const url = urlSearch.rows[0]
        // 
        if(!url){
            return res.status(404).send('essa url não existe')
        }

        if(url.userId !== user.id){
            return res.status(401).send('essa url não pertence a esse usuário')
        }


        // delete
        await db.connection.query('DELETE FROM urls WHERE id = $1', [urlId])

        res.sendStatus(204)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)

    }
}


export {
    listUrl,
    createUrl,
    redirectUrl,


}