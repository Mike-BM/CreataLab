import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on desktop/devices with a fine pointer (mouse)
    if (!window.matchMedia("(pointer: fine)").matches) return;
    
    setIsVisible(true);

    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      // Check if hovering over clickable elements
      const isClickable = 
        e.target.tagName.toLowerCase() === 'button' ||
        e.target.tagName.toLowerCase() === 'a' ||
        e.target.closest('button') ||
        e.target.closest('a') ||
        e.target.closest('.cursor-pointer');
        
      setIsHovering(!!isClickable);
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer Ghost Circle */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 rounded-full border border-purple-500/50 pointer-events-none z-[9999] shadow-[0_0_15px_rgba(168,85,247,0.3)] backdrop-blur-sm"
        animate={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
          scale: isHovering ? 1.5 : 1,
          borderColor: isHovering ? "rgba(236,72,153,0.8)" : "rgba(168,85,247,0.5)",
          backgroundColor: isHovering ? "rgba(236,72,153,0.05)" : "transparent"
        }}
        transition={{ type: "tween", ease: "easeOut", duration: 0.15 }}
      />
      {/* Inner Glowing Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-pink-500 pointer-events-none z-[10000] mix-blend-screen shadow-[0_0_10px_rgba(236,72,153,1)]"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isHovering ? 0 : 1,
        }}
        transition={{ type: "tween", ease: "linear", duration: 0 }}
      />
    </>
  );
}
