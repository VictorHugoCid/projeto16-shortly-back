import { connection } from '../database/db.js'


async function getUser(req, res) {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
        return res.status(401).send('invalid token')
    }

    try {
        // validate session
        const sessionSearch = await connection.query('SELECT * FROM sessions WHERE token = $1', [token])
        const session = sessionSearch.rows[0]
        if (!session) {
            return res.status(401).send('o usuário não está logado')
        }
        // ----------------------------------------------------------------------
        const urlSearch = await connection.query('SELECT * FROM urls WHERE "userId" = $1', [session.userId])
        const url = urlSearch.rows[1]
        console.log(url)

        // validate user
        const userSearch = await connection.query(`
        SELECT 
            users.id,
            users.name,
            SUM("visitCount") as "visitCount"
        FROM users JOIN urls ON users.id = urls."userId" 
        WHERE users.id = $1
        GROUP BY users.id`,
            [session.userId]);
        const user = userSearch.rows[0]

        if (!user) {
            return res.status(404).send('esse usuário não existe')
        }

        const urlsSearch = await connection.query(`
        SELECT 
            urls.id,
            urls."shortUrl",
            urls.url,
            urls."visitCount" 
        FROM urls WHERE urls."userId" = $1`, [session.userId])
        const shortenedUrls = urlsSearch.rows


        const response = {
            user,
            shortenedUrls
        }
        


        res.status(200).send(response)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)

    }
}

async function listRanking(req, res) {

    try {
        const rankingSearch = await connection.query(`
        SELECT 
            users.id,
            users.name,
            COUNT(url) as "linksCount",
            SUM("visitCount") as "visitCount"
        FROM users JOIN urls ON users.id = urls."userId" 
        GROUP BY users.id
        ORDER BY COUNT(url) DESC
        LIMIT 10
        `)
        const ranking = rankingSearch.rows

        res.status(200).send(ranking)

    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}

export {
    getUser,
    listRanking
}