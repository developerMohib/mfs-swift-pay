import { Router } from 'express';
import {
  cashInFromAgent,
  cashOutFromAgent,
  sendMoney,
} from '../controller/transactionController';

const router = Router();

// POST route to create a new user
router.put('/send-money', sendMoney);
router.put('/cash-out', cashOutFromAgent);
router.put('/cash-in', cashInFromAgent);

export const transectionRouter = router;
