import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';
import { Button } from '@/ui/button';
import { appConfig } from '@/lib/config';

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Why Us", href: "#why-us" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar({ activeSection, onSectionChange }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const navigate = useNavigate();
  const location = useLocation();

  const socialLinks = [
    { icon: FaTiktok, href: appConfig.socialLinks.tiktok, label: "TikTok" },
    { icon: FaInstagram, href: appConfig.socialLinks.instagram, label: "Instagram" },
    { icon: FaWhatsapp, href: appConfig.socialLinks.whatsapp, label: "WhatsApp" },
  ].filter(link => link.href); // Filter out empty links

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleNavigation = (href) => {
    setIsMobileMenuOpen(false);

    // If a section-change handler is provided (hybrid navigation on landing),
    // use it for main sections instead of scrolling.
    if (onSectionChange && href.startsWith('#') && href !== '#contact') {
      const sectionId = href.slice(1);
      onSectionChange(sectionId);
      return;
    }

    // Contact should always scroll to the footer section.
    if (href === '#contact') {
      const element = document.querySelector('#contact');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (href.startsWith('/')) {
      navigate(href);
      return;
    }

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.querySelector(href);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
          ? 'bg-white/90 dark:bg-[#0a0a0f]/90 backdrop-blur-2xl border-b border-black/10 dark:border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-transparent'
          }`}
      >
        {/* Animated gradient line at bottom when scrolled */}
        {isScrolled && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600"
          />
        )}

        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo with removed height constraints for maximum visibility */}
            <motion.a
              href="#"
              className="flex items-center gap-3 group relative z-[60]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Removed animated overlay that was distorting the custom logo colors */}
              <img
                src={appConfig.branding.logoUrl}
                alt={appConfig.branding.name}
                className="relative h-28 md:h-36 lg:h-40 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all duration-300 group-hover:scale-105"
                style={{
                  marginTop: '10px',
                  marginBottom: '-20px'
                }}
              />
            </motion.a>

            {/* Desktop Navigation with enhanced animations */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link, index) => (
                <motion.button
                  key={link.label}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleNavigation(link.href)}
                  className={`relative text-sm font-medium group px-2 py-1 transition-all duration-300 ${activeSection && link.href.startsWith('#') && link.href.slice(1) === activeSection
                    ? 'text-black dark:text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
                    }`}
                  whileHover={{ y: -2 }}
                >
                  {link.label}
                  <motion.span
                    className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-cyan-400 via-[#3fb6d6] to-blue-500 rounded-full"
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                  {/* Glow effect on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </motion.button>
              ))}
            </div>

            {/* Social + CTA with enhanced effects */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 p-2 rounded-full bg-white/5 dark:bg-white/5 backdrop-blur-sm border border-white/10">
                <motion.button
                  onClick={toggleTheme}
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600/10 to-pink-600/10 hover:from-purple-600/20 hover:to-pink-600/20 flex items-center justify-center text-gray-600 dark:text-gray-400 transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </motion.button>
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600/10 to-cyan-600/10 hover:from-purple-600/30 hover:to-cyan-600/30 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-white transition-all duration-300 relative overflow-hidden group"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    <social.icon className="w-4 h-4 relative z-10" />
                    <motion.div
                      className="absolute inset-0 bg-white/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </motion.a>
                ))}
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => handleNavigation('#contact')}
                  className="relative bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-full px-6 py-2.5 font-semibold overflow-hidden group shadow-[0_4px_20px_rgba(63,182,214,0.3)] hover:shadow-[0_8px_30px_rgba(63,182,214,0.5)] transition-all duration-300"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <span className="relative z-10">Start a Project</span>
                  <motion.div
                    className="absolute inset-0 bg-white/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </Button>
              </motion.div>
            </div>

            {/* Mobile Menu Button with enhanced styling */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-11 h-11 rounded-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-white/20 dark:border-white/10 flex items-center justify-center text-black dark:text-white shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Enhanced Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 w-80 bg-white/95 dark:bg-[#0a0a0f]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl md:hidden pt-24 overflow-y-auto"
            >
              {/* Gradient accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600" />

              <div className="flex flex-col gap-4 p-8">
                {navLinks.map((link, index) => (
                  <motion.button
                    key={link.label}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08, type: 'spring', stiffness: 200 }}
                    onClick={() => handleNavigation(link.href)}
                    className="group relative text-left text-xl font-semibold text-black dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 py-3 px-4 rounded-xl hover:bg-gradient-to-r hover:from-purple-600/10 hover:to-pink-600/10"
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {link.label}
                    <motion.div
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-gradient-to-b from-purple-500 to-pink-500 rounded-r-full group-hover:h-full transition-all duration-300"
                    />
                  </motion.button>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navLinks.length * 0.08 }}
                  className="mt-8 pt-8 border-t border-white/10 space-y-6"
                >
                  {/* Social Links */}
                  <div className="flex items-center justify-center gap-4">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600/20 to-cyan-600/20 hover:from-purple-600/40 hover:to-cyan-600/40 flex items-center justify-center text-black dark:text-white transition-all duration-300"
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: navLinks.length * 0.08 + index * 0.05 }}
                      >
                        <social.icon className="w-5 h-5" />
                      </motion.a>
                    ))}
                  </div>

                  {/* Theme Toggle */}
                  <motion.button
                    onClick={toggleTheme}
                    className="w-full h-14 rounded-xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 flex items-center justify-center gap-3 text-black dark:text-white font-medium transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    <span>Toggle Theme</span>
                  </motion.button>

                  {/* CTA Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={() => handleNavigation('#contact')}
                      size="lg"
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl px-8 py-6 text-lg font-semibold shadow-[0_4px_20px_rgba(168,85,247,0.4)]"
                    >
                      Start a Project
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}