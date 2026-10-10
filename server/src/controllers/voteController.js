import { supabaseAdmin } from '../config/supabase.js';
import { safeQuery } from '../utils/safeQuery.js';

export async function submitVote(req, res, next) {
  try {
    const { topic_id, option_id, voter_hash } = req.body;

    // Validate option belongs to topic
    const option = await safeQuery(
      supabaseAdmin
        .from('survey_options')
        .select('id, topic_id')
        .eq('id', option_id)
        .eq('topic_id', topic_id)
        .single()
    );

    if (!option) {
      const err = new Error('Invalid option for this topic');
      err.status = 400;
      throw err;
    }

    // Check for existing vote
    const existing = await safeQuery(
      supabaseAdmin
        .from('votes')
        .select('id')
        .eq('topic_id', topic_id)
        .eq('voter_hash', voter_hash)
        .limit(1)
    );

    if (existing && existing.length > 0) {
      const err = new Error('You have already voted on this topic.');
      err.status = 409;
      throw err;
    }

    await safeQuery(
      supabaseAdmin.from('votes').insert({
        topic_id,
        option_id,
        voter_hash,
      })
    );

    // Mark OTP session as consumed (best-effort)
    await supabaseAdmin
      .from('otp_sessions')
      .update({ consumed: true })
      .eq('contact_hash', voter_hash)
      .eq('verified', true)
      .eq('consumed', false)
      .limit(1);

    res.status(201).json({ success: true, message: 'Vote submitted successfully' });
  } catch (err) {
    // Handle race-condition duplicate from DB unique constraint
    if (err.code === '23505') {
      err.status = 409;
      err.message = 'You have already voted on this topic.';
    }
    next(err);
  }
}
