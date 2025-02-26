import { Router } from 'express';
import { sendMoney } from '../controller/transactionController';

const router = Router();

// POST route to create a new user
router.post('/send-money', sendMoney);

export const transectionRouter = router;
