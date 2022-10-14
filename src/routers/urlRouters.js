import express from 'express';
import { listUrl, createUrl, redirectUrl, deleteUrl } from '../controllers/urlControllers.js';
import { validateUrl } from '../middlewares/urlMiddlewares.js'

const router = express.Router();

router.post('/urls/shorten', validateUrl, createUrl)
router.get('/urls/:id', listUrl)
router.get('/urls/open/:shortUrl', redirectUrl)
router.delete('/urls/:id', deleteUrl)

export default router;