import { Shield, TrendingUp, Globe } from 'lucide-react';

export default function Hero() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-stone-100"
    >
      {/* Background gradient layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-100 via-amber-50 to-orange-50" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-amber-300/30 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-orange-300/30 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(180,120,60,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(180,120,60,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 pb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 border border-amber-200 mb-6 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-amber-700 text-sm font-medium tracking-wide">Phase 1 Live — National Expectations Survey</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-stone-800 leading-[1.1] mb-6">
          Your voice.
          <br />
          <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-500 bg-clip-text text-transparent">
            Counted in real time.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-stone-500 max-w-2xl mx-auto leading-relaxed mb-10">
          An unfiltered pipeline to the public's actual concerns. Vote anonymously on what
          matters most — see your vote appear on the live dashboard instantly. No spin, no
          middlemen, just the truth of what the people want.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <button
            onClick={() => scrollTo('survey')}
            className="group px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-lg shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300 hover:scale-105"
          >
            Cast Your Vote
            <span className="inline-block transition-transform group-hover:translate-x-1 ml-2">→</span>
          </button>
          <button
            onClick={() => scrollTo('dashboard')}
            className="px-8 py-4 rounded-xl bg-white border border-stone-200 text-stone-700 font-semibold text-lg hover:bg-stone-50 hover:border-amber-300 transition-all duration-300"
          >
            View Live Results
          </button>
        </div>

        {/* Feature badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <FeatureBadge
            icon={<Shield className="w-5 h-5" />}
            title="OTP-Verified Anonymity"
            description="Your vote is fraud-proof yet anonymous"
          />
          <FeatureBadge
            icon={<TrendingUp className="w-5 h-5" />}
            title="Live Dashboard"
            description="See results update in real time"
          />
          <FeatureBadge
            icon={<Globe className="w-5 h-5" />}
            title="Foreign IP Blocking"
            description="Only citizens' voices count"
          />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
        <div className="w-6 h-10 rounded-full border-2 border-stone-300 flex items-start justify-center p-1.5">
          <div className="w-1 h-2 rounded-full bg-stone-400 animate-bounce" />
        </div>
      </div>
    </section>
  );
}

function FeatureBadge({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/70 border border-stone-200 backdrop-blur-sm hover:border-amber-300 transition-colors duration-300">
      <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
        {icon}
      </div>
      <h3 className="text-stone-800 font-semibold text-sm">{title}</h3>
      <p className="text-stone-500 text-xs">{description}</p>
    </div>
  );
}
