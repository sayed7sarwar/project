import { Router } from 'express';
import { getResults, getTotalVoteCount, getResultsByTopic } from '../controllers/resultController.js';
import { validateParams } from '../middleware/validate.js';
import { idParamSchema } from '../validators/schemas.js';

const router = Router();

router.get('/', getResults);
router.get('/total', getTotalVoteCount);
router.get('/topic/:id', validateParams(idParamSchema), getResultsByTopic);

export default router;
