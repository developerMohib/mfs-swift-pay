import { Router } from 'express';
import { allAgent } from '../controller/agentController';

const router = Router();

// POST route to create a new user
router.get('/agent', allAgent);

export const agentRouter = router;
