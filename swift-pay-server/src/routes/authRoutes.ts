import { Router } from 'express';
import { login, logout, registerUser } from '../controller/authController';

const router =Router();

// POST route to create a new user
router.post('/register', registerUser);
router.post('/login',  login);
router.post('/logout', logout);


export const authRouter = router;