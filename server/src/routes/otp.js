import { Router } from 'express';
import { sendOtp, verifyOtp } from '../controllers/otpController.js';
import { otpLimiter } from '../middleware/rateLimiter.js';
import { validateBody } from '../middleware/validate.js';
import { sendOtpSchema, verifyOtpSchema } from '../validators/schemas.js';

const router = Router();

router.post('/send', otpLimiter, validateBody(sendOtpSchema), sendOtp);
router.post('/verify', otpLimiter, validateBody(verifyOtpSchema), verifyOtp);

export default router;
