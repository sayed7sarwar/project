import { useEffect, useState, useRef } from 'react';
import { BarChart3, TrendingUp, Users, Activity } from 'lucide-react';
import { fetchResults } from '@/lib/api';
import type { TopicResults } from '@/types';

export default function Dashboard() {
  const [results, setResults] = useState<TopicResults[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalVotes, setTotalVotes] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const load = () => {
      fetchResults()
        .then((data) => {
          setResults(data);
          setTotalVotes(data.reduce((sum, t) => sum + t.totalVotes, 0));
          setLoading(false);
          setError(null);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    };
    load();
    intervalRef.current = setInterval(load, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="dashboard"
      className="relative py-24 bg-gradient-to-b from-stone-50 to-amber-50 overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-orange-300/30 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-200 mb-4">
            <Activity className="w-4 h-4 text-green-600 animate-pulse" />
            <span className="text-green-700 text-sm font-medium">Live — updates every 5 seconds</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-stone-800 tracking-tight">
            The People's Dashboard
          </h2>
          <p className="mt-4 text-lg text-stone-500 max-w-2xl mx-auto">
            Real-time results from citizens across the nation. No spin, no filters — just raw data.
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard
            icon={<Users className="w-5 h-5" />}
            label="Total Votes"
            value={totalVotes.toLocaleString()}
          />
          <StatCard
            icon={<BarChart3 className="w-5 h-5" />}
            label="Active Topics"
            value={results.length.toString()}
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Leading Issue"
            value={getLeadingIssue(results)}
          />
          <StatCard
            icon={<Activity className="w-5 h-5" />}
            label="Status"
            value="Live"
            live
          />
        </div>

        {loading && results.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-stone-500">{error}</p>
          </div>
        ) : (
          <div className="space-y-8">
            {results.map((topic, idx) => (
              <TopicChart key={topic.topicId} topic={topic} index={idx} />
            ))}
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-stone-400 text-sm mb-4">
              This data is available via open API for media houses, researchers, and civic organizations.
            </p>
            <button
              onClick={() => scrollTo('survey')}
              className="px-6 py-3 rounded-xl bg-white border border-stone-200 text-stone-700 font-semibold hover:bg-stone-50 hover:border-amber-300 transition-all"
            >
              Haven't voted yet? Cast your vote →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function StatCard({
  icon,
  label,
  value,
  live,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  live?: boolean;
}) {
  return (
    <div className="p-4 rounded-xl bg-white/80 border border-stone-200 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-stone-500 text-sm mb-2">
        <span className="text-amber-600">{icon}</span>
        {label}
      </div>
      <div className="text-2xl font-bold text-stone-800 tabular-nums flex items-center gap-2">
        {value}
        {live && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
        )}
      </div>
    </div>
  );
}

function TopicChart({ topic, index }: { topic: TopicResults; index: number }) {
  const maxVotes = Math.max(...topic.options.map((o) => o.voteCount), 1);
  const sortedOptions = [...topic.options].sort((a, b) => b.voteCount - a.voteCount);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200 p-6 sm:p-8">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
            Topic {index + 1}
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-stone-800 mt-1 leading-tight">
            {topic.title}
          </h3>
        </div>
        <div className="text-right ml-4 flex-shrink-0">
          <div className="text-2xl font-bold text-amber-600 tabular-nums">{topic.totalVotes}</div>
          <div className="text-stone-400 text-xs">votes</div>
        </div>
      </div>

      {topic.totalVotes === 0 ? (
        <p className="text-stone-400 text-sm text-center py-6">
          No votes yet. Be the first to vote on this topic!
        </p>
      ) : (
        <div className="space-y-3">
          {sortedOptions.map((option, optIdx) => {
            const percentage = topic.totalVotes > 0 ? (option.voteCount / topic.totalVotes) * 100 : 0;
            const barWidth = (option.voteCount / maxVotes) * 100;
            const isLeading = optIdx === 0 && option.voteCount > 0;

            return (
              <div key={option.optionId}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    {isLeading && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-bold">
                        #1
                      </span>
                    )}
                    <span className={`text-sm font-medium ${isLeading ? 'text-stone-800' : 'text-stone-600'}`}>
                      {option.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-stone-500 text-sm tabular-nums">
                      {percentage.toFixed(1)}%
                    </span>
                    <span className="text-stone-400 text-xs tabular-nums w-16 text-right">
                      {option.voteCount} votes
                    </span>
                  </div>
                </div>
                <div className="h-2.5 rounded-full bg-stone-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${
                      isLeading
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                        : 'bg-gradient-to-r from-stone-400 to-stone-300'
                    }`}
                    style={{ width: `${Math.max(barWidth, 2)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function getLeadingIssue(results: TopicResults[]): string {
  if (results.length === 0) return '—';
  let maxVotes = 0;
  let leadingLabel = '—';
  for (const topic of results) {
    for (const option of topic.options) {
      if (option.voteCount > maxVotes) {
        maxVotes = option.voteCount;
        leadingLabel = option.label;
      }
    }
  }
  if (maxVotes === 0) return 'Awaiting...';
  return leadingLabel.length > 18 ? leadingLabel.slice(0, 16) + '...' : leadingLabel;
}
