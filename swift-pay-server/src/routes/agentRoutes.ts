import { Router } from 'express';
import { allAgent, updateStatusAgent } from '../controller/agentController';

const router = Router();

// POST route to create a new user
router.get('/agent', allAgent);
router.put('/status/:id', updateStatusAgent);

export const agentRouter = router;
