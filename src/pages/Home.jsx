import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '@/components/landing/navbar';
import Hero from '@/components/landing/hero';
import About from '@/components/landing/about';
import Services from '@/components/landing/services';
import Portfolio from '@/components/landing/portfolio';
import WhyChooseUs from '@/components/landing/whychooseus';
import Founder from '@/components/landing/founder';
import Contact from '@/components/landing/contact';
import Footer from '@/components/landing/footer';
import FloatingBookingButton from '@/components/landing/floatingbookingbutton';
import { Button } from '@/ui/button';

const SECTION_ORDER = ['hero', 'about', 'services', 'portfolio', 'why-us', 'founder'];

const SECTION_COMPONENTS = {
  hero: Hero,
  about: About,
  services: Services,
  portfolio: Portfolio,
  'why-us': WhyChooseUs,
  founder: Founder,
};

export default function Home() {
  const [activeSection, setActiveSection] = useState('hero');

  const { canGoPrev, canGoNext, prevId, nextId } = useMemo(() => {
    const index = SECTION_ORDER.indexOf(activeSection);
    return {
      canGoPrev: index > 0,
      canGoNext: index < SECTION_ORDER.length - 1,
      prevId: index > 0 ? SECTION_ORDER[index - 1] : null,
      nextId: index < SECTION_ORDER.length - 1 ? SECTION_ORDER[index + 1] : null,
    };
  }, [activeSection]);

  const ActiveComponent = SECTION_COMPONENTS[activeSection] ?? Hero;

  const handleSectionChange = (id) => {
    if (SECTION_ORDER.includes(id)) {
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar activeSection={activeSection} onSectionChange={handleSectionChange} />

      <main className="flex-1">
        {/* Discrete main views with animated transitions */}
        <section className="relative min-h-[80vh]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>

          {/* Previous / Next arrows */}
          <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-between max-w-6xl mx-auto px-6">
            <div className="pointer-events-auto">
              <Button
                variant="outline"
                size="sm"
                disabled={!canGoPrev}
                onClick={() => prevId && setActiveSection(prevId)}
                className="rounded-full border-white/20 text-xs text-white/80 bg-black/20 hover:bg-black/40 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </Button>
            </div>
            <div className="pointer-events-auto">
              <Button
                variant="outline"
                size="sm"
                disabled={!canGoNext}
                onClick={() => nextId && setActiveSection(nextId)}
                className="rounded-full border-white/20 text-xs text-white/80 bg-black/20 hover:bg-black/40 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </Button>
            </div>
          </div>
        </section>

        {/* Globally scrollable contact footer */}
        <Contact />
        <Footer />
      </main>

      <FloatingBookingButton />
    </div>
  );
}