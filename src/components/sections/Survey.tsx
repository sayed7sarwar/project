import { useState, useEffect, useCallback } from 'react';
import {
  Shield,
  Check,
  ChevronRight,
  Loader2,
  AlertCircle,
  Lock,
  Mail,
  CheckCircle2,
  Trophy,
} from 'lucide-react';
import { fetchTopicsWithOptions, submitVote, sendEmailOtp, verifyEmailOtp } from '@/lib/api';
import type { TopicWithOptions } from '@/types';

type Stage = 'intro' | 'verify' | 'otp' | 'vote' | 'done';

export default function Survey() {
  const [stage, setStage] = useState<Stage>('intro');
  const [topics, setTopics] = useState<TopicWithOptions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [voterHash, setVoterHash] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const [currentTopicIdx, setCurrentTopicIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());
  const [voteErrors, setVoteErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchTopicsWithOptions()
      .then((data) => {
        setTopics(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const startVerification = () => {
    setStage('verify');
    setError(null);
  };

  const sendOtp = async () => {
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }
    setVerifying(true);
    setError(null);

    const result = await sendEmailOtp(email.trim());
    setVerifying(false);

    if (result.success) {
      setStage('otp');
      setCanResend(false);
      setResendTimer(60);
    } else {
      setError(result.error || 'Failed to send verification code. Please try again.');
    }
  };

  const resendOtp = async () => {
    setVerifying(true);
    setError(null);
    const result = await sendEmailOtp(email.trim());
    setVerifying(false);
    if (result.success) {
      setCanResend(false);
      setResendTimer(60);
    } else {
      setError(result.error || 'Failed to resend code. Please try again.');
    }
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }
    setVerifying(true);
    setError(null);

    const result = await verifyEmailOtp(email.trim(), otp);
    setVerifying(false);

    if (result.success && result.voterHash) {
      setVoterHash(result.voterHash);
      setStage('vote');
      setCurrentTopicIdx(0);
      setSelectedOption(null);
    } else {
      setError(result.error || 'Verification failed. Please try again.');
    }
  };

  const handleVote = useCallback(async () => {
    if (!selectedOption || topics.length === 0) return;
    const currentTopic = topics[currentTopicIdx];
    setSubmitting(true);
    setVoteErrors({});

    const result = await submitVote(currentTopic.topic.id, selectedOption, voterHash);
    setSubmitting(false);

    if (result.success) {
      setCompletedTopics((prev) => new Set(prev).add(currentTopic.topic.id));

      if (currentTopicIdx < topics.length - 1) {
        setCurrentTopicIdx(currentTopicIdx + 1);
        setSelectedOption(null);
      } else {
        setStage('done');
      }
    } else {
      setVoteErrors({ [currentTopic.topic.id]: result.error || 'Failed to submit vote' });
      if (result.error?.includes('already voted')) {
        setCompletedTopics((prev) => new Set(prev).add(currentTopic.topic.id));
        if (currentTopicIdx < topics.length - 1) {
          setCurrentTopicIdx(currentTopicIdx + 1);
          setSelectedOption(null);
        } else {
          setStage('done');
        }
      }
    }
  }, [selectedOption, topics, currentTopicIdx, voterHash]);

  const reset = () => {
    setStage('intro');
    setEmail('');
    setOtp('');
    setVoterHash('');
    setSelectedOption(null);
    setCurrentTopicIdx(0);
    setCompletedTopics(new Set());
    setVoteErrors({});
    setError(null);
    setCanResend(false);
    setResendTimer(0);
  };

  if (loading) {
    return (
      <section id="survey" className="py-24 bg-stone-50 min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
      </section>
    );
  }

  if (error && stage === 'intro') {
    return (
      <section id="survey" className="py-24 bg-stone-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-stone-500">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="survey"
      className="relative py-24 bg-gradient-to-b from-amber-50 via-stone-50 to-amber-50 overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-amber-300/30 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-amber-600 font-semibold text-sm tracking-widest uppercase">
            Cast Your Vote
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-stone-800 tracking-tight">
            Make your voice count
          </h2>
        </div>

        {/* Progress bar */}
        {stage !== 'intro' && stage !== 'done' && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-stone-500 text-sm">
                {stage === 'verify' && 'Step 1: Verify your identity'}
                {stage === 'otp' && 'Step 2: Enter verification code'}
                {stage === 'vote' && `Topic ${currentTopicIdx + 1} of ${topics.length}`}
              </span>
              {stage === 'vote' && (
                <div className="flex gap-1.5">
                  {topics.map((t, i) => (
                    <div
                      key={t.topic.id}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        completedTopics.has(t.topic.id)
                          ? 'bg-green-500 w-2'
                          : i === currentTopicIdx
                          ? 'bg-amber-500 w-8'
                          : 'bg-stone-300 w-2'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="h-1 rounded-full bg-stone-200 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                style={{
                  width:
                    stage === 'verify'
                      ? '15%'
                      : stage === 'otp'
                      ? '35%'
                      : `${35 + (65 * (currentTopicIdx + 1)) / topics.length}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Intro Stage */}
        {stage === 'intro' && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-stone-200 p-8 sm:p-10 shadow-lg shadow-amber-900/5">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center">
                <Lock className="w-8 h-8 text-amber-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-stone-800 mb-2">Anonymous & Fraud-Proof</h3>
                <p className="text-stone-500 leading-relaxed">
                  Your identity is verified with a one-time code to prevent fraud and duplicate
                  voting — but your vote itself is completely anonymous. No one can trace your
                  choice back to you.
                </p>
              </div>

              <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 my-2">
                <InfoPill icon={<Shield className="w-4 h-4" />} text="OTP Verified" />
                <InfoPill icon={<Lock className="w-4 h-4" />} text="100% Anonymous" />
                <InfoPill icon={<CheckCircle2 className="w-4 h-4" />} text="1 Vote / Topic" />
              </div>

              <button
                onClick={startVerification}
                className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300 hover:scale-105"
              >
                Start Verification
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* Verify Stage */}
        {stage === 'verify' && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-stone-200 p-8 sm:p-10 shadow-lg shadow-amber-900/5">
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-xl font-bold text-stone-800 mb-2">Verify your identity</h3>
                <p className="text-stone-500 text-sm">
                  Enter your email address to receive a one-time verification code.
                </p>
              </div>

              <div>
                <label className="block text-stone-700 text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendOtp()}
                    placeholder="you@example.com"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl text-stone-800 py-3.5 pl-12 pr-4 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <div className="flex items-center gap-2 text-stone-400 text-xs">
                <Lock className="w-3.5 h-3.5" />
                Your email is hashed and never stored in plain text. It cannot be linked to your vote.
              </div>

              <button
                onClick={sendOtp}
                disabled={verifying}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold hover:shadow-lg hover:shadow-amber-500/25 transition-all disabled:opacity-50"
              >
                {verifying ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending code...
                  </>
                ) : (
                  <>
                    Send Verification Code
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* OTP Stage */}
        {stage === 'otp' && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-stone-200 p-8 sm:p-10 shadow-lg shadow-amber-900/5">
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center">
                <Shield className="w-8 h-8 text-amber-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-stone-800 mb-2">Enter the 6-digit code</h3>
                <p className="text-stone-500 text-sm">
                  We sent a verification code to{' '}
                  <span className="text-amber-700 font-medium">{email}</span>
                </p>
                <p className="text-stone-400 text-xs mt-1">
                  Check your inbox (and spam folder just in case).
                </p>
              </div>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                onKeyDown={(e) => e.key === 'Enter' && verifyOtp()}
                placeholder="000000"
                className="w-full max-w-xs text-center text-3xl font-bold tracking-[0.5em] bg-stone-50 border border-stone-200 rounded-xl text-stone-800 py-4 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
              />

              {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <button
                onClick={verifyOtp}
                disabled={verifying || otp.length !== 6}
                className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold hover:shadow-lg hover:shadow-amber-500/25 transition-all disabled:opacity-50"
              >
                {verifying ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Verify & Continue
                  </>
                )}
              </button>

              <div className="flex items-center justify-between w-full max-w-xs">
                <button
                  onClick={() => setStage('verify')}
                  className="text-stone-400 text-sm hover:text-stone-600 transition-colors"
                >
                  ← Change email
                </button>
                {canResend ? (
                  <button
                    onClick={resendOtp}
                    disabled={verifying}
                    className="text-amber-600 text-sm font-medium hover:text-amber-700 transition-colors disabled:opacity-50"
                  >
                    Resend code
                  </button>
                ) : (
                  <span className="text-stone-400 text-sm">
                    Resend in {resendTimer}s
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Vote Stage */}
        {stage === 'vote' && topics.length > 0 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-lg shadow-amber-900/5">
            {(() => {
              const current = topics[currentTopicIdx];
              const topicError = voteErrors[current.topic.id];
              return (
                <>
                  <div className="mb-6">
                    <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold mb-3">
                      {current.topic.category}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-stone-800 leading-tight">
                      {current.topic.title}
                    </h3>
                    <p className="text-stone-500 text-sm mt-2">{current.topic.description}</p>
                  </div>

                  {topicError && !topicError.includes('already voted') && (
                    <div className="mb-4 flex items-center gap-2 text-red-500 text-sm bg-red-50 rounded-lg px-4 py-3">
                      <AlertCircle className="w-4 h-4" />
                      {topicError}
                    </div>
                  )}

                  <div className="space-y-3">
                    {current.options.map((option) => {
                      const isSelected = selectedOption === option.id;
                      const alreadyVoted = completedTopics.has(current.topic.id);
                      return (
                        <button
                          key={option.id}
                          onClick={() => !alreadyVoted && setSelectedOption(option.id)}
                          disabled={alreadyVoted}
                          className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                            alreadyVoted
                              ? 'border-green-300 bg-green-50 cursor-not-allowed'
                              : isSelected
                              ? 'border-amber-500 bg-amber-50 scale-[1.02]'
                              : 'border-stone-200 bg-stone-50 hover:border-amber-300 hover:bg-amber-50/50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                alreadyVoted
                                  ? 'border-green-500 bg-green-500'
                                  : isSelected
                                  ? 'border-amber-500 bg-amber-500'
                                  : 'border-stone-300'
                              }`}
                            >
                              {(isSelected || alreadyVoted) && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <div>
                              <p
                                className={`font-semibold ${
                                  alreadyVoted ? 'text-green-700' : 'text-stone-800'
                                }`}
                              >
                                {option.label}
                              </p>
                              {option.description && (
                                <p className="text-stone-400 text-sm mt-1">{option.description}</p>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleVote}
                    disabled={!selectedOption || submitting || completedTopics.has(current.topic.id)}
                    className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold hover:shadow-lg hover:shadow-amber-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : completedTopics.has(current.topic.id) ? (
                      <>
                        <Check className="w-5 h-5" />
                        Already Voted — Next
                      </>
                    ) : currentTopicIdx < topics.length - 1 ? (
                      <>
                        Submit Vote
                        <ChevronRight className="w-5 h-5" />
                      </>
                    ) : (
                      <>
                        Submit Final Vote
                        <Check className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </>
              );
            })()}
          </div>
        )}

        {/* Done Stage */}
        {stage === 'done' && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-stone-200 p-8 sm:p-10 text-center shadow-lg shadow-amber-900/5">
            <div className="flex flex-col items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-stone-800 mb-2">Your voice has been heard!</h3>
                <p className="text-stone-500 leading-relaxed max-w-md">
                  Thank you for participating in the National Expectations Survey. Your votes are
                  now reflected on the live dashboard for the entire nation to see.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  onClick={() => {
                    document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex-1 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold hover:shadow-lg hover:shadow-amber-500/25 transition-all"
                >
                  View Live Results →
                </button>
                <button
                  onClick={reset}
                  className="flex-1 px-6 py-3.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 font-semibold hover:bg-stone-100 transition-all"
                >
                  Vote Again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function InfoPill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200">
      <span className="text-amber-600">{icon}</span>
      <span className="text-stone-700 text-sm font-medium">{text}</span>
    </div>
  );
}


