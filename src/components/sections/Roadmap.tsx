import { Flag, ArrowRight } from 'lucide-react';

const phases = [
  {
    phase: 'Phase 1',
    status: 'Live Now',
    title: 'National Expectations Survey',
    description:
      'OTP-verified anonymous voting on national priorities with a live dashboard. Foreign IP blocking ensures only citizens participate.',
    features: [
      'OTP-verified anonymity',
      'Live results dashboard',
      'Foreign IP blocking',
      'One vote per person per topic',
    ],
    color: 'amber',
    active: true,
  },
  {
    phase: 'Phase 2',
    status: 'Coming Soon',
    title: 'State-Wise Localized Surveys',
    description:
      'Drill down into state-level concerns. Citizens vote on issues specific to their state, with state-wise dashboards and comparative analysis.',
    features: [
      'State-level survey topics',
      'Comparative state dashboards',
      'Regional trend analysis',
      'Multi-language support',
    ],
    color: 'orange',
    active: false,
  },
  {
    phase: 'Phase 3',
    status: 'Future',
    title: 'Hyper-Local Grievance Tracking',
    description:
      'Citizens raise hyper-local grievances with photographic evidence. Validator queues ensure authenticity. Auto-routing to administrative offices enables data-driven accountability.',
    features: [
      'Photo evidence uploads',
      'Validator queue system',
      'Auto-escalation to officials',
      'Geo-tagged grievance map',
      'PIL-ready evidence repository',
    ],
    color: 'rose',
    active: false,
  },
];

const colorMap: Record<string, { border: string; bg: string; text: string; dot: string }> = {
  amber: { border: 'border-amber-300', bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  orange: { border: 'border-orange-300', bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500' },
  rose: { border: 'border-rose-300', bg: 'bg-rose-100', text: 'text-rose-700', dot: 'bg-rose-500' },
};

export default function Roadmap() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="roadmap" className="relative py-24 bg-amber-50 overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(180,120,60,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(180,120,60,0.3) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-amber-600 font-semibold text-sm tracking-widest uppercase">
            The Vision
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-stone-800 tracking-tight">
            A phased rollout to transform democracy
          </h2>
          <p className="mt-6 text-lg text-stone-500 max-w-2xl mx-auto leading-relaxed">
            From national priorities to hyper-local grievances — building the infrastructure for
            data-driven, citizen-powered governance.
          </p>
        </div>

        <div className="relative">
          {/* Vertical line for desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-amber-400/40 via-orange-300/20 to-transparent -translate-x-1/2" />

          <div className="space-y-8 md:space-y-16">
            {phases.map((phase, index) => {
              const colors = colorMap[phase.color];
              const isLeft = index % 2 === 0;

              return (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row gap-6 md:gap-12 ${
                    isLeft ? '' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Card */}
                  <div className="flex-1">
                    <div
                      className={`p-6 sm:p-8 rounded-2xl bg-white/80 border ${colors.border} backdrop-blur-sm transition-all duration-300 hover:bg-white`}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <span
                          className={`px-3 py-1 rounded-full ${colors.bg} ${colors.text} text-xs font-bold`}
                        >
                          {phase.phase}
                        </span>
                        <span
                          className={`flex items-center gap-1.5 text-xs font-medium ${
                            phase.active ? 'text-green-600' : 'text-stone-400'
                          }`}
                        >
                          {phase.active && (
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                            </span>
                          )}
                          {phase.status}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold text-stone-800 mb-3">{phase.title}</h3>
                      <p className="text-stone-500 text-sm leading-relaxed mb-5">
                        {phase.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {phase.features.map((feature, fi) => (
                          <div
                            key={fi}
                            className="flex items-center gap-2 text-sm text-stone-600"
                          >
                            <div className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                            {feature}
                          </div>
                        ))}
                      </div>

                      {phase.active && (
                        <button
                          onClick={() => scrollTo('survey')}
                          className="mt-6 flex items-center gap-2 text-amber-600 font-semibold text-sm hover:gap-3 transition-all"
                        >
                          Participate now
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Center dot for desktop */}
                  <div className="hidden md:flex items-center justify-center w-12 flex-shrink-0">
                    <div
                      className={`w-4 h-4 rounded-full ${colors.dot} ring-4 ring-amber-50 ${
                        phase.active ? 'animate-pulse' : ''
                      }`}
                    />
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="flex-1 hidden md:block" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Future vision callout */}
        <div className="mt-16 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-amber-100 to-orange-50 border border-amber-200 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Flag className="w-6 h-6 text-amber-600" />
            <h3 className="text-xl font-bold text-stone-800">The End Goal</h3>
          </div>
          <p className="text-stone-500 max-w-2xl mx-auto leading-relaxed">
            A nation where every citizen's voice is heard, counted, and acted upon — where data
            replaces rhetoric, and transparency replaces silence. This is not just a platform; it
            is a movement toward truly participatory democracy.
          </p>
        </div>
      </div>
    </section>
  );
}
