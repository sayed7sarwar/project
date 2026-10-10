import rateLimit from 'express-rate-limit';
import { config } from '../config/env.js';

export const generalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.general,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

export const otpLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.otp,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many OTP requests. Please try again later.' },
});

export const voteLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.vote,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many vote attempts. Please try again later.' },
});
