import { Router } from 'express';
import {
  cashOutFromAgent,
  sendMoney,
} from '../controller/transactionController';

const router = Router();

// POST route to create a new user
router.put('/send-money', sendMoney);
router.put('/cash-out', cashOutFromAgent);

export const transectionRouter = router;
