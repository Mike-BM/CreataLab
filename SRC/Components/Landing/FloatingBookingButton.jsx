import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, X } from 'lucide-react';
import BookingModal from './BookingModal';

export default function FloatingBookingButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling past hero section (about 80vh)
      setIsVisible(window.scrollY > window.innerHeight * 0.8);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setBookingOpen(true)}
            className="fixed bottom-8 right-8 z-40 w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-[0_0_30px_rgba(168,85,247,0.5)] flex items-center justify-center text-white hover:shadow-[0_0_40px_rgba(168,85,247,0.7)] transition-all duration-300"
          >
            <Calendar className="w-7 h-7" />
          </motion.button>
        )}
      </AnimatePresence>

      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </>
  );
}
