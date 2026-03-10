import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/UI/button';

export default function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const [history, setHistory] = useState([]);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Track navigation history
    const currentPath = location.pathname;
    
    setHistory((prev) => {
      // Don't add duplicate consecutive entries
      if (prev.length === 0 || prev[prev.length - 1] !== currentPath) {
        return [...prev, currentPath];
      }
      return prev;
    });

    // Show back button if not on home page
    setShowButton(currentPath !== '/' && currentPath !== '/blog');
  }, [location.pathname]);

  const handleBack = () => {
    if (history.length > 1) {
      // Navigate to previous page in history
      const previousPath = history[history.length - 2];
      navigate(previousPath);
    } else {
      // Fallback: go to home
      navigate('/');
    }
  };

  const handleHome = () => {
    navigate('/');
  };

  // Don't show on home page
  if (!showButton) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="fixed bottom-6 left-6 z-50 flex flex-col gap-3"
      >
        {/* Back Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={handleBack}
            className="group relative bg-gradient-to-r from-purple-600/90 to-pink-600/90 hover:from-purple-500 hover:to-pink-500 backdrop-blur-xl border border-white/20 text-white rounded-full px-5 py-3 shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"
            />
          </Button>
        </motion.div>

        {/* Home Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={handleHome}
            className="group relative bg-white/10 dark:bg-white/5 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300"
            title="Go to Home"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
