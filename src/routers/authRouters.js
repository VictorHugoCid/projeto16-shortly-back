import express from 'express';
import { signUp, signIn, logOut } from '../controllers/authControllers.js';
// import * as authMiddlewares from '../middlewares/authMiddlewares.js'

const router = express.Router();
// console.log('authRouter')

router.post('/signin', signIn)
router.post('/signup', signUp)
router.delete('/logOut', logOut)

export default router;