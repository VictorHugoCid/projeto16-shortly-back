import express from 'express';
import { getUser, listRanking } from '../controllers/othersControllers.js';
// import * as authMiddlewares from '../middlewares/authMiddlewares.js'

const router = express.Router();

router.get('/users/me', getUser)
router.get('/ranking', listRanking)

export default router;