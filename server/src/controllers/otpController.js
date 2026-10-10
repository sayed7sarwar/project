import { supabaseAdmin } from '../config/supabase.js';
import { safeQuery } from '../utils/safeQuery.js';
import { sha256, generateOtp } from '../utils/crypto.js';
import { config } from '../config/env.js';

export async function sendOtp(req, res, next) {
  try {
    const { contact } = req.body;
    const contactHash = sha256(contact);
    const otpCode = generateOtp(config.otp.length);
    const expiresAt = new Date(Date.now() + config.otp.expiryMinutes * 60 * 1000).toISOString();

    await safeQuery(
      supabaseAdmin.from('otp_sessions').insert({
        contact,
        contact_hash: contactHash,
        otp_code: otpCode,
        verified: false,
        expires_at: expiresAt,
        consumed: false,
      })
    );

    // In production: integrate SMS/email provider here.
    // For now, return the code in dev mode only.
    const response = { message: 'OTP sent successfully' };
    if (!config.isProduction) {
      response.devOtp = otpCode;
    }

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
}

export async function verifyOtp(req, res, next) {
  try {
    const { contact, otp } = req.body;
    const contactHash = sha256(contact);

    const sessions = await safeQuery(
      supabaseAdmin
        .from('otp_sessions')
        .select('*')
        .eq('contact_hash', contactHash)
        .eq('verified', false)
        .eq('consumed', false)
        .order('created_at', { ascending: false })
        .limit(1)
    );

    if (!sessions || sessions.length === 0) {
      const err = new Error('No active OTP session found. Please request a new code.');
      err.status = 404;
      throw err;
    }

    const session = sessions[0];

    if (new Date(session.expires_at) < new Date()) {
      const err = new Error('OTP has expired. Please request a new code.');
      err.status = 410;
      throw err;
    }

    if (session.otp_code !== otp) {
      const err = new Error('Incorrect OTP. Please try again.');
      err.status = 401;
      throw err;
    }

    await safeQuery(
      supabaseAdmin
        .from('otp_sessions')
        .update({ verified: true })
        .eq('id', session.id)
    );

    const voterHash = sha256(contact + ':' + session.id);

    res.json({
      verified: true,
      voterHash,
      sessionId: session.id,
    });
  } catch (err) {
    next(err);
  }
}
