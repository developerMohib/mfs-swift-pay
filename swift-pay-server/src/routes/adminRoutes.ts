import { Router } from 'express';
import { agentCashInRequests, getAdmin, loginAdmin } from '../controller/adminController';

const router = Router();
router.put('/login',loginAdmin);

// Get admin balance
router.get('/balance');
router.get('/find',getAdmin);
router.put('/cash-in',agentCashInRequests);

export const adnminRouter = router;
