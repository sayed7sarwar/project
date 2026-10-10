import dotenv from 'dotenv';

dotenv.config();

function required(key, fallback = undefined) {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const config = {
  port: parseInt(process.env.PORT || '8080', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  corsOrigin: process.env.CORS_ORIGIN || '*',

  supabase: {
    url: required('SUPABASE_URL'),
    serviceRoleKey: required('SUPABASE_SERVICE_ROLE_KEY'),
  },

  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    general: 100,
    otp: 5,
    vote: 30,
  },

  otp: {
    expiryMinutes: 10,
    length: 6,
  },
};
