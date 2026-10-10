export type SurveyTopic = {
  id: string;
  title: string;
  description: string;
  category: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
};

export type SurveyOption = {
  id: string;
  topic_id: string;
  label: string;
  description: string | null;
  display_order: number;
  created_at: string;
};

export type Vote = {
  id: string;
  topic_id: string;
  option_id: string;
  voter_hash: string;
  country_code: string | null;
  created_at: string;
};

export type TopicWithOptions = {
  topic: SurveyTopic;
  options: SurveyOption[];
};

export type OptionVoteCount = {
  optionId: string;
  label: string;
  description: string | null;
  voteCount: number;
};

export type TopicResults = {
  topicId: string;
  title: string;
  totalVotes: number;
  options: OptionVoteCount[];
};

export type TopicWithVoteCounts = {
  topic: SurveyTopic;
  options: (SurveyOption & { vote_count: number })[];
  total_votes: number;
};
