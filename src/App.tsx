import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import Mission from '@/components/sections/Mission';
import Survey from '@/components/sections/Survey';
import Dashboard from '@/components/sections/Dashboard';
import Roadmap from '@/components/sections/Roadmap';

export default function App() {
  return (
    <div className="min-h-screen bg-stone-100 antialiased">
      <Navbar />
      <main>
        <Hero />
        <Mission />
        <Survey />
        <Dashboard />
        <Roadmap />
      </main>
      <Footer />
    </div>
  );
}
