import express from 'express';
import { signUp, signIn, logOut } from '../controllers/authControllers.js';
import { validateSignUp, validateSignIn } from '../middlewares/authMiddlewares.js'
// import {signUpSchema, signInSchema} from '../schemas/authSchema.js'
// import { validateSchema } from '../middlewares/validateSchema.js'
const router = express.Router();
// console.log('authRouter')

router.post('/signin', validateSignIn, signIn)
router.post('/signup', validateSignUp, signUp)
router.delete('/logOut', logOut)

export default router;