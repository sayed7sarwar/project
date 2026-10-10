import { supabaseAdmin } from '../config/supabase.js';
import { safeQuery } from '../utils/safeQuery.js';

export async function getResults(_req, res, next) {
  try {
    const [topics, options] = await Promise.all([
      safeQuery(
        supabaseAdmin
          .from('survey_topics')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
      ),
      safeQuery(
        supabaseAdmin
          .from('survey_options')
          .select('*')
          .order('display_order', { ascending: true })
      ),
    ]);

    const results = [];

    for (const topic of topics) {
      const votes = await safeQuery(
        supabaseAdmin.from('votes').select('option_id').eq('topic_id', topic.id)
      );

      const counts = new Map();
      for (const v of votes) {
        counts.set(v.option_id, (counts.get(v.option_id) || 0) + 1);
      }

      const totalVotes = votes.length;

      results.push({
        topicId: topic.id,
        title: topic.title,
        totalVotes,
        options: options
          .filter((o) => o.topic_id === topic.id)
          .map((o) => ({
            optionId: o.id,
            label: o.label,
            description: o.description,
            voteCount: counts.get(o.id) || 0,
          })),
      });
    }

    res.json({ results });
  } catch (err) {
    next(err);
  }
}

export async function getTotalVoteCount(_req, res, next) {
  try {
    const { count, error } = await supabaseAdmin
      .from('votes')
      .select('*', { count: 'exact', head: true });

    if (error) throw new Error(error.message);

    res.json({ totalVotes: count || 0 });
  } catch (err) {
    next(err);
  }
}

export async function getResultsByTopic(req, res, next) {
  try {
    const { id } = req.params;

    const topic = await safeQuery(
      supabaseAdmin.from('survey_topics').select('*').eq('id', id).single()
    );

    if (!topic) {
      const err = new Error('Topic not found');
      err.status = 404;
      throw err;
    }

    const [options, votes] = await Promise.all([
      safeQuery(
        supabaseAdmin
          .from('survey_options')
          .select('*')
          .eq('topic_id', id)
          .order('display_order', { ascending: true })
      ),
      safeQuery(
        supabaseAdmin.from('votes').select('option_id').eq('topic_id', id)
      ),
    ]);

    const counts = new Map();
    for (const v of votes) {
      counts.set(v.option_id, (counts.get(v.option_id) || 0) + 1);
    }

    res.json({
      topicId: topic.id,
      title: topic.title,
      totalVotes: votes.length,
      options: options.map((o) => ({
        optionId: o.id,
        label: o.label,
        description: o.description,
        voteCount: counts.get(o.id) || 0,
      })),
    });
  } catch (err) {
    next(err);
  }
}
