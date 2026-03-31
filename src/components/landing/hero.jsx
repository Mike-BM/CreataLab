import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Calendar, MonitorPlay } from 'lucide-react';
import { Button } from '@/ui/button';
import { appConfig } from '@/lib/config';
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0f]">
      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
      {/* Enhanced Animated gradient orbs with more dynamic movement */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Only show largest orbs on desktop to save mobile performance */}
        <motion.div
          animate={{
            x: [0, 150, -50, 0],
            y: [0, -80, 50, 0],
            scale: [1, 1.3, 0.9, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-purple-600/25 rounded-full blur-[80px] md:blur-[150px]"
        />
        <motion.div
          animate={{
            x: [0, -120, 60, 0],
            y: [0, 100, -40, 0],
            scale: [1, 1.4, 0.8, 1],
            rotate: [0, -180, -360],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-cyan-500/25 rounded-full blur-[70px] md:blur-[130px]"
        />
        
        {/* These smaller orbs provide enough visual interest on mobile without killing FPS */}
        <motion.div
          animate={{
            x: [0, 80, -30, 0],
            y: [0, 120, -60, 0],
            scale: [1, 1.2, 0.95, 1],
            rotate: [0, 90, 180],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 right-1/3 w-[200px] h-[200px] md:w-[400px] md:h-[400px] bg-pink-500/20 rounded-full blur-[60px] md:blur-[110px]"
        />
        
        {/* Hide extra-deep elements on mobile */}
        <motion.div
          animate={{
            x: [0, 60, -40, 0],
            y: [0, -100, 80, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-3/4 left-1/3 w-[150px] h-[150px] md:w-[250px] md:h-[250px] bg-cyan-400/15 rounded-full blur-[50px] md:blur-[90px] hidden md:block"
        />
        <motion.div
          animate={{
            x: [0, -70, 50, 0],
            y: [0, 90, -50, 0],
            scale: [1, 1.15, 0.85, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/3 left-1/2 w-[120px] h-[120px] md:w-[200px] md:h-[200px] bg-purple-400/12 rounded-full blur-[40px] md:blur-[70px] hidden md:block"
        />
      </div>

      {/* Enhanced Grid pattern overlay with animation */}
      <motion.div
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px]"
      />

      {/* Enhanced diagonal lines with shimmer effect */}
      <div className="absolute inset-0 opacity-25">
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(168,85,247,0.05)_49%,rgba(168,85,247,0.05)_51%,transparent_52%)] bg-[size:80px_80px]"
        />
      </div>

      {/* Floating particles effect */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-white/30 rounded-full"
          style={{
            left: particle.left,
            top: particle.top,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          {/* Top label badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-cyan-600/20 border border-white/20 backdrop-blur-xl mb-8 shadow-[0_0_25px_rgba(59,130,246,0.3)]"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 text-purple-300" />
            </motion.div>
            <span className="text-sm font-medium text-gray-200">
              {appConfig.branding.tagline}
            </span>
          </motion.div>

          {/* Headline - Simplified for high conversion */}
          <div className="mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-8 tracking-tight"
            >
              Transform Your Vision Into a 
              <span className="relative inline-block ml-2">
                <span className="relative z-10 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
                  Digital Powerhouse
                </span>
                <motion.span
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full blur-sm"
                />
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-300 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed mb-8"
            >
              Stop settling for average. We engineer modern websites and precision branding that don't just look stunning—they <span className="text-white font-bold underline decoration-purple-500 decoration-2 underline-offset-4">attract customers and fuel business growth.</span>
            </motion.p>

            {/* Social Proof Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-4 mb-10"
            >
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0a0a0f] bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full bg-purple-500/10 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                    </div>
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-[#0a0a0f] bg-purple-600 flex items-center justify-center text-[10px] font-black text-white">
                  90+
                </div>
              </div>
              <div className="text-left">
                <div className="text-white font-black text-sm uppercase tracking-tight">90+ Projects Executed</div>
                <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Global Creative Excellence</div>
              </div>
            </motion.div>
          </div>

          {/* Value bullets - Enhanced with animations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-10 flex flex-wrap justify-center gap-3"
          >
            {valueBullets.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1, type: 'spring' }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-gray-200 backdrop-blur-sm hover:bg-white/10 hover:border-purple-500/30 transition-all cursor-pointer"
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent('portfolioFilter', { detail: item.category })
                  );
                }}
              >
                {item.label}
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons - High Conversion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                size="lg"
                onClick={() => setBookingOpen(true)}
                className="relative bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-10 py-7 text-lg font-bold rounded-2xl transition-all duration-300 shadow-[0_20px_50px_-20px_rgba(6,182,212,0.5)] border border-white/10"
              >
                <span className="flex items-center gap-3">
                  <MonitorPlay className="w-5 h-5" />
                  Launch Your Idea
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                size="lg"
                onClick={() => window.open(appConfig.socialLinks.whatsapp, '_blank')}
                className="bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 px-10 py-7 text-lg font-bold rounded-2xl transition-all duration-300 shadow-[0_20px_50px_-20px_rgba(255,255,255,0.1)]"
              >
                <span className="flex items-center gap-3">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.412.001 12.048c0 2.123.541 4.196 1.582 6.075L0 24l6.12-1.605a11.827 11.827 0 005.928 1.599h.004c6.636 0 12.046-5.411 12.049-12.047.003-3.21-1.248-6.227-3.522-8.5l-.004-.001z" />
                  </svg>
                  Chat on WhatsApp
                </span>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Enhanced Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer"
          onClick={() => {
            const aboutSection = document.querySelector('#about');
            if (aboutSection) aboutSection.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-7 h-12 border-2 border-white/30 rounded-full flex justify-center pt-3 backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.1 }}
          >
            <motion.div
              animate={{
                opacity: [0.3, 1, 0.3],
                y: [0, 8, 0]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-2 h-2 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"
            />
          </motion.div>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-xs text-gray-400 mt-2 text-center"
          >
            Scroll
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}