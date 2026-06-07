import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, MonitorPlay } from 'lucide-react';
import { Button } from '@/ui/button';
import BookingModal from './bookingmodal.jsx';

export default function Hero() {
  const [bookingOpen, setBookingOpen] = useState(false);

  const valueBullets = [
    { label: 'Branding & Marketing Assets', category: 'Branding & Marketing Assets' },
    { label: 'Data Insights', category: 'Data' },
    { label: 'AI Solutions', category: 'AI Solutions' },
    { label: 'Performance Design', category: 'Digital' },
  ];

  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: 3 + Math.random() * 2,
        delay: Math.random() * 2,
      })),
    []
  );

  return (
    <section className="relative min-h-screen flex items-center bg-background overflow-hidden pt-20">
      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
      
      {/* Soft background glow */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[400px] bg-accent/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 flex flex-col items-start text-left">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="w-full max-w-4xl relative"
        >
          {/* Top label badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-block px-5 py-2 mb-8 rounded-full border border-border bg-surface shadow-soft"
          >
            <span className="text-sm font-bold text-muted uppercase tracking-widest font-grotesk">
              Modern Web Design & Powerful Branding Solutions
            </span>
          </motion.div>

          {/* Stats Badge overlapping */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="absolute -top-6 right-0 md:right-10 bg-accent text-accent-foreground p-4 rounded-3xl shadow-soft z-20 hidden sm:flex flex-col items-center justify-center"
          >
            <div className="flex gap-1 mb-1">
              <Sparkles className="w-4 h-4 transform rotate-12" />
              <Sparkles className="w-3 h-3 transform -rotate-45" />
              <Sparkles className="w-5 h-5 transform rotate-90" />
              <Sparkles className="w-3 h-3 transform rotate-180" />
            </div>
            <div className="font-black font-grotesk text-2xl leading-none">90+</div>
            <div className="text-[10px] font-bold uppercase tracking-tighter text-background/80 mt-1 text-center max-w-[80px]">
              Projects Executed
            </div>
          </motion.div>

          {/* Headline */}
          <div className="mb-10 relative">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight tracking-tight max-w-5xl"
            >
              Transform Your Vision Into a<br />
              <span className="text-gradient">
                Digital Powerhouse
              </span>
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-muted text-lg md:text-xl font-normal max-w-2xl leading-[1.7] mb-12"
          >
            Stop settling for average. We engineer modern websites and precision branding that don't just look stunning—they <span className="text-foreground font-bold">attract customers and fuel business growth.</span>
          </motion.p>

          {/* Value bullets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-12 flex flex-wrap items-center gap-4"
          >
            {valueBullets.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1, type: 'spring' }}
                whileHover={{ scale: 1.05 }}
                className="px-6 py-3 rounded-full border border-border bg-surface text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all cursor-pointer shadow-soft"
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent('portfolioFilter', { detail: item.category })
                  );
                }}
              >
                <span className="relative z-10">{item.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-6"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: -1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                onClick={() => setBookingOpen(true)}
                className="bg-accent text-accent-foreground rounded-full font-bold px-8 py-6 flex items-center gap-3 group border border-transparent hover:bg-accent-hover shadow-soft hover:shadow-md transition-all"
              >
                <MonitorPlay className="w-5 h-5" />
                Get a Quote
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, rotate: 1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  const section = document.querySelector('#portfolio');
                  if (section) section.scrollIntoView({ behavior: 'smooth' });
                }}
                className="rounded-full px-8 py-6 font-bold bg-surface hover:bg-muted text-foreground border-border shadow-soft"
              >
                View Our Work
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}