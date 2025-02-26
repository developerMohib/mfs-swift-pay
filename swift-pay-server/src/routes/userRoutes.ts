import { Router } from 'express';
import { allUser, updateStatus } from '../controller/userController';

const router = Router();

// POST route to create a new user
router.get('/users', allUser);
router.put('/status/:id', updateStatus);

export const userRouter = router;
