import { Users, Building2, Newspaper, Landmark, Scale, Flag } from 'lucide-react';

const impacts = [
  {
    icon: <Users className="w-6 h-6" />,
    title: 'For GenZ & GenAlpha',
    description:
      'Re-engages youth in democracy through radical transparency and digital-first interaction. Seeing their vote increment live on a dashboard restores faith that their voice actually counts.',
    color: 'amber',
  },
  {
    icon: <Building2 className="w-6 h-6" />,
    title: 'For the Common People',
    description:
      'Bypasses bureaucratic silence. Gives citizens a fraud-proof, anonymous platform to voice expectations and raise hyper-local grievances with photographic evidence.',
    color: 'orange',
  },
  {
    icon: <Newspaper className="w-6 h-6" />,
    title: 'For the Media',
    description:
      'Breaks the monopoly on agenda-setting. Open, real-time data APIs force prime-time debates to reflect actual ground realities — jobs, education — not manufactured distractions.',
    color: 'rose',
  },
  {
    icon: <Landmark className="w-6 h-6" />,
    title: 'For the Government',
    description:
      'Forces data-driven accountability. Auto-escalation of localized grievances makes ignoring public issues politically and administratively impossible.',
    color: 'emerald',
  },
  {
    icon: <Scale className="w-6 h-6" />,
    title: 'For the Judiciary',
    description:
      'Creates a massive, geo-tagged, timestamped repository of systemic failures. This empirical data serves as foundational evidence for Public Interest Litigations.',
    color: 'sky',
  },
  {
    icon: <Flag className="w-6 h-6" />,
    title: 'For the Party (CJP)',
    description:
      'Establishes CJP as the pioneer of democratic tech and radical transparency. Shifts politics from empty promises to data-backed, actionable mandates.',
    color: 'stone',
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  amber: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', glow: 'hover:shadow-amber-500/10' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', glow: 'hover:shadow-orange-500/10' },
  rose: { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200', glow: 'hover:shadow-rose-500/10' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', glow: 'hover:shadow-emerald-500/10' },
  sky: { bg: 'bg-sky-100', text: 'text-sky-700', border: 'border-sky-200', glow: 'hover:shadow-sky-500/10' },
  stone: { bg: 'bg-stone-200', text: 'text-stone-700', border: 'border-stone-300', glow: 'hover:shadow-stone-500/10' },
};

export default function Mission() {
  return (
    <section id="mission" className="relative py-24 bg-amber-50 overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 50%, rgba(217,119,6,0.15) 0%, transparent 60%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-amber-600 font-semibold text-sm tracking-widest uppercase">
            Systemic Impact
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-stone-800 tracking-tight">
            Built to shift how power
            <br className="hidden sm:block" />
            <span className="text-amber-600"> interacts with the citizen</span>
          </h2>
          <p className="mt-6 text-lg text-stone-500 max-w-2xl mx-auto leading-relaxed">
            In an era of manufactured narratives, this platform serves as an unadulterated
            pipeline to the public's actual concerns. It is not just a website — it is a tool
            for fundamental change.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {impacts.map((item, index) => {
            const colors = colorMap[item.color];
            return (
              <div
                key={index}
                className={`group p-7 rounded-2xl bg-white/80 border ${colors.border} backdrop-blur-sm transition-all duration-300 hover:bg-white hover:-translate-y-1 hover:shadow-xl ${colors.glow}`}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div
                  className={`w-14 h-14 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}
                >
                  {item.icon}
                </div>
                <h3 className="text-stone-800 font-bold text-lg mb-3">{item.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
