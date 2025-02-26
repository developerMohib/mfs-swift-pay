import { Router } from 'express';
import { loginAdmin } from '../controller/adminController';

const router = Router();
router.post('/login',loginAdmin);

// Get admin balance
router.get('/balance');

export const adnminRouter = router;
