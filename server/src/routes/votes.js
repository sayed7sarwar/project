import { Router } from 'express';
import { submitVote } from '../controllers/voteController.js';
import { voteLimiter } from '../middleware/rateLimiter.js';
import { validateBody } from '../middleware/validate.js';
import { submitVoteSchema } from '../validators/schemas.js';

const router = Router();

router.post('/', voteLimiter, validateBody(submitVoteSchema), submitVote);

export default router;
