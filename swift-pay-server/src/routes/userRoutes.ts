import { Router } from 'express';
import { allUser, updateStatus, userTransaction } from '../controller/userController';

const router = Router();

// POST route to create a new user
router.get('/users', allUser);
router.get('/transactions/:userId', userTransaction);
router.put('/status/:id', updateStatus);

export const userRouter = router;
