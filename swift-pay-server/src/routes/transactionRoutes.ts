import { Router } from 'express';
import {
  allTransaction,
  cashDeposit,
  cashInFromAgent,
  cashOutFromAgent,
  sendMoney,
} from '../controller/transactionController';

const router = Router();

// POST route to create a new user
router.get('/transaction', allTransaction);
router.put('/send-money', sendMoney);
router.put('/cash-out', cashOutFromAgent);
router.put('/cash-in', cashInFromAgent);
router.put('/cash-deposit', cashDeposit);

export const transectionRouter = router;
