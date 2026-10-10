import { useEffect, useState } from 'react';
import { Vote, BarChart3, Eye, Target } from 'lucide-react';
import { fetchTotalVoteCount } from '@/lib/api';

export default function Navbar() {
  const [totalVotes, setTotalVotes] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const loadCount = () => {
      fetchTotalVoteCount()
        .then(setTotalVotes)
        .catch(() => {});
    };
    loadCount();
    const interval = setInterval(loadCount, 8000);

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-stone-50/95 backdrop-blur-md shadow-lg shadow-amber-900/10 border-b border-amber-200/40'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo('hero')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Vote className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-stone-800 font-bold text-lg tracking-tight">JanMati</span>
              <span className="text-amber-600 text-xs ml-1 font-medium">CJP</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1">
            <NavButton icon={<Eye className="w-4 h-4" />} label="Mission" onClick={() => scrollTo('mission')} />
            <NavButton icon={<Vote className="w-4 h-4" />} label="Vote Now" onClick={() => scrollTo('survey')} />
            <NavButton icon={<BarChart3 className="w-4 h-4" />} label="Live Dashboard" onClick={() => scrollTo('dashboard')} />
            <NavButton icon={<Target className="w-4 h-4" />} label="Roadmap" onClick={() => scrollTo('roadmap')} />
          </div>

          <div className="flex items-center gap-3">
            {totalVotes !== null && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 border border-amber-200">
                <div className="relative flex items-center">
                  <span className="absolute -left-0.5 w-2 h-2 rounded-full bg-green-500 animate-ping opacity-75" />
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <span className="text-amber-700 font-semibold text-sm tabular-nums">
                  {totalVotes.toLocaleString()}
                </span>
                <span className="text-amber-600/60 text-xs hidden sm:inline">votes</span>
              </div>
            )}
            <button
              onClick={() => scrollTo('survey')}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-200 hover:scale-105"
            >
              Vote
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-stone-600 hover:text-amber-700 hover:bg-amber-50 transition-all duration-200 text-sm font-medium"
    >
      {icon}
      {label}
    </button>
  );
}
