import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Calendar } from 'lucide-react';
import { Button } from '@/ui/button';
import { appConfig } from '@/lib/config';
import BookingModal from './bookingmodal.jsx';

export default function Hero() {
  const [bookingOpen, setBookingOpen] = useState(false);

  const valueBullets = [
    { label: 'Branding', category: 'Branding' },
    { label: 'Data Insights', category: 'Data' },
    { label: 'Web Platforms', category: 'Web' },
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
        <motion.div
          animate={{
            x: [0, 150, -50, 0],
            y: [0, -80, 50, 0],
            scale: [1, 1.3, 0.9, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-600/25 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{
            x: [0, -120, 60, 0],
            y: [0, 100, -40, 0],
            scale: [1, 1.4, 0.8, 1],
            rotate: [0, -180, -360],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/25 rounded-full blur-[130px]"
        />
        <motion.div
          animate={{
            x: [0, 80, -30, 0],
            y: [0, 120, -60, 0],
            scale: [1, 1.2, 0.95, 1],
            rotate: [0, 90, 180],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 right-1/3 w-[400px] h-[400px] bg-pink-500/20 rounded-full blur-[110px]"
        />
        {/* Additional smaller orbs for depth */}
        <motion.div
          animate={{
            x: [0, 60, -40, 0],
            y: [0, -100, 80, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-3/4 left-1/3 w-[250px] h-[250px] bg-cyan-400/15 rounded-full blur-[90px]"
        />
        <motion.div
          animate={{
            x: [0, -70, 50, 0],
            y: [0, 90, -50, 0],
            scale: [1, 1.15, 0.85, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/3 left-1/2 w-[200px] h-[200px] bg-purple-400/12 rounded-full blur-[70px]"
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

          {/* Headline - Improved sizing and readability */}
          <div className="mb-8">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.2] mb-6"
            >
              <motion.span
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="inline-block text-white font-semibold"
              >
                Where{' '}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                className="inline-block bg-gradient-to-r from-cyan-300 via-[#3fb6d6] to-blue-500 bg-clip-text text-transparent animate-gradient font-bold"
              >
                Creativity
              </motion.span>
              <br className="md:hidden" />
              <span className="hidden md:inline"> </span>
              <motion.span
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="inline-block text-white font-semibold"
              >
                Meets{' '}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, type: 'spring', stiffness: 200 }}
                className="inline-block bg-gradient-to-l from-cyan-300 via-[#3fb6d6] to-blue-500 bg-clip-text text-transparent animate-gradient font-bold"
              >
                Data
              </motion.span>
            </motion.h1>

            {/* Decorative underline - matched to logo color */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '120px' }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="h-0.5 bg-gradient-to-r from-cyan-400 via-[#3fb6d6] to-blue-500 rounded-full mx-auto shadow-[0_0_15px_rgba(63,182,214,0.5)]"
            />
          </div>

          {/* Improved description with better spacing */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-base md:text-lg lg:text-xl text-gray-200 max-w-3xl mx-auto mb-10 leading-relaxed px-4"
          >
            We partner with startups and NGOs to shape strategic brands, unlock data intelligence,
            and build innovative digital platforms that convert, perform, and scale.
          </motion.p>

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

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                onClick={() => setBookingOpen(true)}
                className="group relative bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-6 text-base font-semibold rounded-full transition-all duration-300 shadow-[0_0_30px_rgba(63,182,214,0.4)] hover:shadow-[0_0_40px_rgba(63,182,214,0.6)] border-2 border-cyan-400/30 overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <motion.div
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
                <span className="relative z-10 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Start Your Project
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                onClick={() => {
                  const portfolioSection = document.querySelector('#portfolio');
                  if (portfolioSection) portfolioSection.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group relative bg-gradient-to-r from-cyan-600/15 to-blue-600/15 border-2 border-cyan-500/40 text-white hover:border-cyan-400/80 hover:bg-gradient-to-r hover:from-cyan-600/25 hover:to-blue-600/25 px-8 py-6 text-base font-semibold rounded-full backdrop-blur-xl transition-all duration-300 shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] overflow-hidden"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent"
                />
                <span className="relative z-10">View Case Studies</span>
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