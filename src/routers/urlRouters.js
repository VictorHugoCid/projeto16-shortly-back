import express from 'express';
import { getUrlById, createUrl, redirectUrl, deleteUrl } from '../controllers/urlControllers.js';
import { validateUrl } from '../middlewares/urlMiddlewares.js'
import { validateSession } from '../middlewares/sessionMiddlewares.js'

const router = express.Router();

router.post('/urls/shorten', validateSession, validateUrl, createUrl)
router.get('/urls/:id', getUrlById)
router.get('/urls/open/:shortUrl', redirectUrl)
router.delete('/urls/:id',validateSession, deleteUrl)

export default router;
