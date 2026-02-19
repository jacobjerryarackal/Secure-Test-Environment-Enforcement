import { Router } from 'express';
import { createAttempt,submitAttempt,getAttempt,} from '../controllers/attempt-controller.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import {createAttemptSchema,submitAttemptSchema,} from '../requests/attempt-requests.js';

const router = Router();

// 1. Static/Specific routes FIRST
router.post('/submit', validateRequest(submitAttemptSchema), submitAttempt);

// 2. Dynamic/Parameter routes LAST
router.post('/', validateRequest(createAttemptSchema), createAttempt);
router.get('/:attemptId', getAttempt);

export default router;