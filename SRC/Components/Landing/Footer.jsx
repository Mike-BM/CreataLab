import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const links = {
    services: [
      { label: "Brand Identity", href: "#services" },
      { label: "Digital Design", href: "#services" },
      { label: "Data Analysis", href: "#services" },
      { label: "Web Solutions", href: "#services" },
    ],
    company: [
      { label: "About Us", href: "#about" },
      { label: "Portfolio", href: "#portfolio" },
      { label: "Contact", href: "#contact" },
    ],
    social: [
      { icon: FaTiktok, href: "https://www.tiktok.com/@creatalab_ltd", label: "TikTok" },
      { icon: FaInstagram, href: "https://www.instagram.com/creatalab?igsh=NjM5cG9yajJhdzE1", label: "Instagram" },
      { icon: FaWhatsapp, href: "https://wa.me/0753436729", label: "WhatsApp" },
    ]
  };

  return (
    <footer className="bg-[#0a0a0f] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
                CreataLab
              </span>
            </div>
            <p className="text-gray-400 max-w-md mb-6 leading-relaxed">
              A creative-tech lab helping brands communicate ideas through stunning design,
              actionable data insights, and cutting-edge digital solutions.
            </p>
            <p className="text-purple-400 text-sm font-medium mb-4">Follow us for updates</p>
            <div className="flex flex-wrap gap-3">
              {links.social.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 hover:text-white hover:border-transparent hover:scale-125 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">Services</h3>
            <ul className="space-y-3">
              {links.services.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">Company</h3>
            <ul className="space-y-3">
              {links.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center gap-4 pt-8 border-t border-white/10">
          <p className="text-gray-500 text-sm text-center">
            © {new Date().getFullYear()} CreataLab. All rights reserved.
          </p>

          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white hover:shadow-lg hover:shadow-purple-500/25 transition-shadow"
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
