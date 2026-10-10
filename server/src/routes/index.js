import { Router } from 'express';
import healthRoutes from './health.js';
import topicRoutes from './topics.js';
import resultRoutes from './results.js';
import otpRoutes from './otp.js';
import voteRoutes from './votes.js';

const router = Router();

router.use('/', healthRoutes);
router.use('/topics', topicRoutes);
router.use('/results', resultRoutes);
router.use('/otp', otpRoutes);
router.use('/votes', voteRoutes);

export default router;
