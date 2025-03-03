import { Router } from 'express';
import { allAgent, cashInOkayAgent, getPendingCashInRequests, updateStatusAgent } from '../controller/agentController';

const router = Router();

// POST route to create a new user
router.get('/agent', allAgent);
router.put('/status/:id', updateStatusAgent);
router.put('/request/:id', cashInOkayAgent);
router.get('/cash-in/request',getPendingCashInRequests );

export const agentRouter = router;
