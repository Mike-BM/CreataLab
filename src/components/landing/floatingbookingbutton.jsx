import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, X } from 'lucide-react';
import BookingModal from './bookingmodal.jsx';
import { appConfig } from '@/lib/config';

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
          <div className="fixed bottom-8 right-8 z-40 flex flex-col gap-4">
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => window.open(appConfig.socialLinks.whatsapp, '_blank')}
              className="w-16 h-16 bg-green-500 rounded-full shadow-[0_0_30px_rgba(34,197,94,0.4)] flex items-center justify-center text-white hover:shadow-[0_0_40px_rgba(34,197,94,0.6)] transition-all duration-300"
            >
              <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.412.001 12.048c0 2.123.541 4.196 1.582 6.075L0 24l6.12-1.605a11.827 11.827 0 005.928 1.599h.004c6.636 0 12.046-5.411 12.049-12.047.003-3.21-1.248-6.227-3.522-8.5l-.004-.001z" />
              </svg>
            </motion.button>
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setBookingOpen(true)}
              className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-[0_0_30px_rgba(168,85,247,0.5)] flex items-center justify-center text-white hover:shadow-[0_0_40px_rgba(168,85,247,0.7)] transition-all duration-300"
            >
              <Calendar className="w-7 h-7" />
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </>
  );
}