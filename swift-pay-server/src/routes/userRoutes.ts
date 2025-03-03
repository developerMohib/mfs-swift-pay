import { Router } from 'express';
import { allUser, getLoginUser, updateStatus, userTransaction } from '../controller/userController';
import { allTransaction } from '../controller/transactionController';

const router = Router();

// POST route to create a new user
router.get('/users', allUser);
router.get('/find/:id', getLoginUser);
router.get('/transaction', allTransaction);
router.get('/transactions/:userId', userTransaction);
router.put('/status/:id', updateStatus);

export const userRouter = router;
