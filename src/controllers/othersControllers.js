import { connection } from '../database/db.js'


async function getUser(req, res) {
    const { token } = req.headers.authorization?.replace('Bearer ', '')


    try {
        // validate session
        const sessionSearch = await connection.query('SELECT * FROM sessions WHERE token = $1', [token])
        const session = sessionSearch.rows[0]
        if (!session) {
            return res.status(401).send('o usuário não está logado')
        }
        // ----------------------------------------------------------------------
        // select user
        const userSearch = await connection.query('SELECT * FROM users WHERE id = $1', [session.userId]);
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
        
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}


export {
    getUser,
    listRanking

}