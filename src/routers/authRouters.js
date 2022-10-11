import express from 'express';
import * as authControllers from '../controllers/authControllers.js';
import * as authMiddlewares from '../middlewares/authMiddlewares.js'

const router = express.Router();

router.post('/singin', authControllers.signIn)
router.post('/singup', authControllers.signUp)

export default router;