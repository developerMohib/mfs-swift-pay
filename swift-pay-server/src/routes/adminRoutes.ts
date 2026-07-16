import { Router } from 'express';

import {
  agentCashInRequests,
  balanceInSystem,
  getAdmin,
  loginAdmin,
} from '../controller/adminController';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize_rba.middleware';

const router = Router();

// Public: admin sign-in
router.put('/login', loginAdmin);

// Basic admin display info (name/phone/email) - any signed-in role may
// need this (e.g. an agent viewing who to contact for cash-in requests)
router.get('/find', authenticate, getAdmin);

// Sensitive: system-wide balance figures - admin only
router.get('/balance', authenticate, authorize('admin'), balanceInSystem);

// An agent asking to top up their float from the admin - agent action
router.put('/cash-in', authenticate, authorize('agent'), agentCashInRequests);
export const adminRouter = router;