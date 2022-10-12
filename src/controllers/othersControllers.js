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
            users."visitCount"
            json_build_object(
                'id', url.id, 
                'shortUrl', url."shortUrl", 
                'url', url.url, 
                'visitCount', url."visitCount" 
            ) as "shortenedUrls"
        FROM users 
        WHERE id = $1`, 
        [session.userId]);
        const user = userSearch.rows[0]

        if(!user){
            return res.status(404).send('esse usuário não existe')
        }


        res.status(200).send(user)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)

    }
}

async function listRanking(req, res){


    try {
        const rankingSearch = await connection.query(`
        SELECT
            users.id, 
            users.name,
            COUNT(url) as "linksCount"
        FROM users JOIN urls ON users.id = urls."userId"
        GROUP BY users.id
        ORDER BY users.id ASC
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