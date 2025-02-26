import { Router } from 'express';
import { allUser } from '../controller/userController';

const router = Router();

// POST route to create a new user
router.get('/users', allUser);

export const userRouter = router;
