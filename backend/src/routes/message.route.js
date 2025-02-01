import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getMessages, getUsers, sendMessages } from '../controllers/message.controller.js';

const router = express.Router();

router.get('/users', protectRoute, getUsers);
router.get('/:id', protectRoute, getMessages);

router.post('/:id', protectRoute, sendMessages);

export default router;