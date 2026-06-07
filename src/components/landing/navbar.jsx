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
  { label: "Media Hub", href: "/media-hub" },
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
    document.documentElement.classList.remove('dark'); // Force light mode
  }, []);

  const handleNavigation = (href) => {
    setIsMobileMenuOpen(false);

    if (onSectionChange && href.startsWith('#') && href !== '#contact') {
      const sectionId = href.slice(1);
      onSectionChange(sectionId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (href === '#contact') {
      const element = document.querySelector('#contact');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
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
        if (element) {
          const offset = 80;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.querySelector(href);
      if (element) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-surface/90 backdrop-blur-md shadow-sm border-b border-border'
          : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo with imperfect geometric shapes */}
            <motion.a
              href="#"
              className="flex items-center gap-2 group relative z-[60] font-bold text-2xl tracking-tight text-foreground"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-8 h-8 rounded-lg bg-[#38bdf8] flex items-center justify-center text-white font-bold text-lg">
                C
              </div>
              <span>Creata<span className="text-[#38bdf8]">Lab</span></span>
            </motion.a>

            {/* Desktop Navigation with intentional uneven spacing */}
            <div className="hidden md:flex items-center">
              {navLinks.map((link, index) => (
                <motion.button
                  key={link.label}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleNavigation(link.href)}
                  className={`relative text-sm font-medium transition-all duration-300 mr-6 ${
                    activeSection && link.href.startsWith('#') && link.href.slice(1) === activeSection
                      ? 'text-accent'
                      : 'text-muted hover:text-foreground'
                  }`}
                  whileHover={{ y: -2 }}
                >
                  {link.label}
                </motion.button>
              ))}
            </div>

            {/* Social + CTA with physical hovers */}
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-5">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-accent transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05, type: "spring", stiffness: 300 }}
                  >
                    <social.icon className="w-6 h-6" />
                  </motion.a>
                ))}
              </div>
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => handleNavigation('#contact')}
                  className="bg-accent text-white rounded-full font-bold px-6 py-5 flex items-center gap-2 group hover:bg-accent-hover shadow-soft transition-all"
                >
                  <span>Start a Project</span>
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

                  {/* Removed theme toggle */}

                  {/* CTA Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={() => handleNavigation('#contact')}
                      size="lg"
                      className="w-full bg-accent hover:bg-accent-hover text-white rounded-xl px-8 py-4 font-semibold shadow-soft"
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