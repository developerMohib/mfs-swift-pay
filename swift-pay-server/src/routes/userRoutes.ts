import { Router } from 'express';
import { allUser, getLoginUser, updateStatus, userDetails, userTransaction } from '../controller/userController';
import { authenticate } from '../middleware/authenticate';

const router = Router();

// POST route to create a new user
router.get('/users', allUser);
router.get('/transactions/:userId', userTransaction);

router.get('/find/:id', getLoginUser);
router.get('/details', authenticate, userDetails);
router.put('/status/:id', updateStatus);

export const userRouter = router;
