import { Router } from 'express';
import { receiveLogs, getLogsByAttempt } from '../controllers/log-controller.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { batchLogSchema } from '../requests/log-requests.js';

const router = Router();

// Batch ingestion of logs
router.post(
  '/',
  validateRequest(batchLogSchema),
  receiveLogs
);

router.get('/:attemptId', getLogsByAttempt);

export default router;