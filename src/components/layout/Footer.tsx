import { Vote, Github, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-stone-100 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="sm:col-span-2 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Vote className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-stone-800 font-bold text-lg">JanMati</span>
                <span className="text-amber-600 text-xs ml-1 font-medium">CJP</span>
              </div>
            </div>
            <p className="text-stone-500 text-sm leading-relaxed max-w-md">
              An unadulterated pipeline to the public's actual concerns. Built to fundamentally
              shift how power, administration, and media interact with the common citizen.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <SocialButton icon={<Twitter className="w-4 h-4" />} />
              <SocialButton icon={<Github className="w-4 h-4" />} />
              <SocialButton icon={<Mail className="w-4 h-4" />} />
            </div>
          </div>

          <div>
            <h4 className="text-stone-800 font-semibold text-sm mb-4">Platform</h4>
            <div className="space-y-3">
              <FooterLink label="Mission" onClick={() => scrollTo('mission')} />
              <FooterLink label="Vote Now" onClick={() => scrollTo('survey')} />
              <FooterLink label="Live Dashboard" onClick={() => scrollTo('dashboard')} />
              <FooterLink label="Roadmap" onClick={() => scrollTo('roadmap')} />
            </div>
          </div>

          <div>
            <h4 className="text-stone-800 font-semibold text-sm mb-4">Principles</h4>
            <div className="space-y-3">
              <FooterLink label="Radical Transparency" />
              <FooterLink label="Anonymous Voting" />
              <FooterLink label="Open Data API" />
              <FooterLink label="Citizen First" />
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-stone-400 text-sm">
            © 2026 JanMati — A CJP Initiative. All rights reserved.
          </p>
          <p className="text-stone-400 text-xs">
            Built for the people, by the people. Every voice matters.
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialButton({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="w-9 h-9 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:text-amber-600 hover:border-amber-300 transition-all">
      {icon}
    </button>
  );
}

function FooterLink({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="block text-stone-500 text-sm hover:text-amber-600 transition-colors text-left"
    >
      {label}
    </button>
  );
}
