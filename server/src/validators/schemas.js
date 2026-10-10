import { z } from 'zod';

export const sendOtpSchema = z.object({
  contact: z
    .string()
    .min(1, 'Contact is required')
    .refine(
      (val) => /^[6-9]\d{9}$/.test(val) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      'Must be a valid Indian phone number (10 digits starting 6-9) or an email address'
    ),
  method: z.enum(['phone', 'email']).default('phone'),
});

export const verifyOtpSchema = z.object({
  contact: z.string().min(1, 'Contact is required'),
  otp: z
    .string()
    .length(6, 'OTP must be 6 digits')
    .regex(/^\d{6}$/, 'OTP must be numeric'),
});

export const submitVoteSchema = z.object({
  topic_id: z.string().uuid('Invalid topic ID'),
  option_id: z.string().uuid('Invalid option ID'),
  voter_hash: z.string().min(16, 'Voter hash is required'),
});

export const idParamSchema = z.object({
  id: z.string().uuid('Invalid ID'),
});
