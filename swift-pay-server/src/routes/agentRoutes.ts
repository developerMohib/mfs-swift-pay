import { Router } from 'express';
import { allAgent, getPendingCashInRequests, updateStatusAgent } from '../controller/agentController';

const router = Router();

// POST route to create a new user
router.get('/agent', allAgent);
router.put('/status/:id', updateStatusAgent);
router.get('/cash-in/request',getPendingCashInRequests );

export const agentRouter = router;
