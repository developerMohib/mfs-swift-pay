import { Router } from 'express';
import { login, logout, registerUser } from '../controller/authController';

import { authenticate } from '../middleware/authenticate';
const router = Router();

router.post('/register', registerUser);
router.post('/login', login);
router.post('/logout', logout);

export const authRouter = router;