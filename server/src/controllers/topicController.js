import { supabaseAdmin } from '../config/supabase.js';
import { safeQuery } from '../utils/safeQuery.js';

export async function getTopics(_req, res, next) {
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

    const result = topics.map((topic) => ({
      topic,
      options: options.filter((o) => o.topic_id === topic.id),
    }));

    res.json({ topics: result });
  } catch (err) {
    next(err);
  }
}

export async function getTopicById(req, res, next) {
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

    const options = await safeQuery(
      supabaseAdmin
        .from('survey_options')
        .select('*')
        .eq('topic_id', id)
        .order('display_order', { ascending: true })
    );

    res.json({ topic, options });
  } catch (err) {
    next(err);
  }
}
