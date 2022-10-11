import express from 'express';
import * as authController from '../controllers/authController.js';
import * as authMiddlewares from '../middlewares/authMiddlewares.js'

const router = express.Router();

router.post('/singin', authController.singin)
router.post('/singup', authController.singup)

export default router;