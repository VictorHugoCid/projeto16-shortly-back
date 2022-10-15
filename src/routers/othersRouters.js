import express from 'express';
import { getUser, listRanking } from '../controllers/othersControllers.js';
import { validateSession } from '../middlewares/sessionMiddlewares.js'

const router = express.Router();

router.get('/users/me', validateSession, getUser)
router.get('/ranking', listRanking)

export default router;