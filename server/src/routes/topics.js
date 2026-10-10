import { Router } from 'express';
import { getTopics, getTopicById } from '../controllers/topicController.js';
import { validateParams } from '../middleware/validate.js';
import { idParamSchema } from '../validators/schemas.js';

const router = Router();

router.get('/', getTopics);
router.get('/:id', validateParams(idParamSchema), getTopicById);

export default router;
