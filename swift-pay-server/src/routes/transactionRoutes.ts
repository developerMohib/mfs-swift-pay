import { Router } from 'express';
import { sendMoney } from '../controller/transactionController';

const router = Router();

// POST route to create a new user
router.put('/send-money', sendMoney);

export const transectionRouter = router;
