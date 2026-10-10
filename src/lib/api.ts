import { supabase } from './supabase';
import type {
  SurveyTopic,
  SurveyOption,
  TopicWithOptions,
  TopicResults,
} from '@/types';

export async function fetchTopicsWithOptions(): Promise<TopicWithOptions[]> {
  const [topicsRes, optionsRes] = await Promise.all([
    supabase
      .from('survey_topics')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true }),
    supabase
      .from('survey_options')
      .select('*')
      .order('display_order', { ascending: true }),
  ]);

  if (topicsRes.error) throw new Error(topicsRes.error.message);
  if (optionsRes.error) throw new Error(optionsRes.error.message);

  const topics = topicsRes.data as SurveyTopic[];
  const options = (optionsRes.data || []) as SurveyOption[];

  return topics.map((topic) => ({
    topic,
    options: options.filter((o) => o.topic_id === topic.id),
  }));
}

export async function fetchResults(): Promise<TopicResults[]> {
  const topicsWithOptions = await fetchTopicsWithOptions();

  const results: TopicResults[] = [];

  for (const { topic, options } of topicsWithOptions) {
    const { data: votes, error } = await supabase
      .from('votes')
      .select('option_id')
      .eq('topic_id', topic.id);

    if (error) throw new Error(error.message);

    const voteList = votes || [];
    const totalVotes = voteList.length;
    const counts = new Map<string, number>();
    for (const v of voteList) {
      counts.set(v.option_id, (counts.get(v.option_id) || 0) + 1);
    }

    results.push({
      topicId: topic.id,
      title: topic.title,
      totalVotes,
      options: options.map((o) => ({
        optionId: o.id,
        label: o.label,
        description: o.description,
        voteCount: counts.get(o.id) || 0,
      })),
    });
  }

  return results;
}

export async function fetchTotalVoteCount(): Promise<number> {
  const { count, error } = await supabase
    .from('votes')
    .select('*', { count: 'exact', head: true });

  if (error) throw new Error(error.message);
  return count || 0;
}

export async function sendEmailOtp(email: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.auth.signInWithOtp({
    email: email.toLowerCase().trim(),
    options: {
      shouldCreateUser: true,
      emailRedirectTo: window.location.origin,
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function verifyEmailOtp(
  email: string,
  otp: string
): Promise<{ success: boolean; voterHash?: string; error?: string }> {
  const { error } = await supabase.auth.verifyOtp({
    email: email.toLowerCase().trim(),
    token: otp,
    type: 'email',
  });

  if (error) {
    return { success: false, error: error.message };
  }

  const voterHash = await sha256Browser(email.toLowerCase().trim());
  return { success: true, voterHash };
}

async function sha256Browser(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function submitVote(
  topicId: string,
  optionId: string,
  voterHash: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from('votes').insert({
    topic_id: topicId,
    option_id: optionId,
    voter_hash: voterHash,
  });

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: 'You have already voted on this topic.' };
    }
    return { success: false, error: error.message };
  }
  return { success: true };
}
