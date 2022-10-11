import express from 'express';
import { listUrl, createUrl, redirectUrl, deleteUrl } from '../controllers/urlControllers.js';
import * as urlMiddlewares from '../middlewares/urlMiddlewares.js'

const router = express.Router();

router.post('/urls/shorten', createUrl)
router.get('/urls/:id',listUrl)
router.get('/urls/open/:shortUrl',redirectUrl)
router.delete('/urls/:id',deleteUrl)

export default router;