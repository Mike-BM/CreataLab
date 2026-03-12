import { motion } from 'framer-motion';
import { ArrowUp, Mail, Phone, MapPin } from 'lucide-react';
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
      { label: "AI Solutions", href: "#services" },
    ],
    company: [
      { label: "About Us", href: "#about" },
      { label: "Portfolio", href: "#portfolio" },
      { label: "Why Us", href: "#why-us" },
      { label: "Contact", href: "#contact" },
    ],
    social: [
      { icon: FaTiktok, href: "https://www.tiktok.com/@creatalab_ltd", label: "TikTok", color: "from-purple-500 to-purple-700" },
      { icon: FaInstagram, href: "https://www.instagram.com/creatalab?igsh=NjM5cG9yajJhdzE1", label: "Instagram", color: "from-pink-500 to-orange-500" },
      { icon: FaWhatsapp, href: "https://wa.me/254753436729?text=Hello%20Welcome%20to%20CreataLab%20%E2%80%93%20Where%20Creativity%20Meets%20Data!%20We%20craft%20Graphic%20Design%2C%20Branding%2C%20Data%20Analysis%2C%20AI%2C%20and%20Web%20Development%20solutions%20that%20elevate%20your%20ideas.%20Let%E2%80%99s%20create%20something%20extraordinary%20%E2%80%93%20how%20can%20we%20help%20you%20today%3F", label: "WhatsApp", color: "from-green-500 to-emerald-600" },
    ],
    contact: [
      { icon: Mail, label: "hello@creatalab.com", href: "mailto:hello@creatalab.com" },
      { icon: Phone, label: "0753 436 729", href: "tel:0753436729" },
      { icon: MapPin, label: "Nairobi, Kenya", href: "#" },
    ]
  };

  return (
    <footer className="relative bg-[#0a0a0f] overflow-hidden">
      {/* Glowing background orbs */}
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[400px] h-[250px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-pink-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Top glowing divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="w-full h-px bg-gradient-to-r from-transparent via-pink-500/40 to-transparent -mt-px"
      />

      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">

        {/* Brand section — centered on all screens */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          {/* Glowing logo text */}
          <motion.div
            className="text-4xl md:text-5xl font-extrabold mb-4 inline-block"
            whileHover={{ scale: 1.05 }}
          >
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
              CreataLab
            </span>
          </motion.div>

          <p className="text-gray-400 max-w-md mx-auto mb-8 leading-relaxed text-sm md:text-base">
            A creative-tech lab helping brands communicate ideas through stunning design,
            actionable data insights, and cutting-edge digital solutions.
          </p>

          {/* Social icons — centered, glowing */}
          <div className="flex items-center justify-center gap-4 mb-2">
            {links.social.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.2, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${social.color} flex items-center justify-center text-white shadow-lg transition-all duration-300`}
                style={{
                  boxShadow: '0 0 0 rgba(168,85,247,0)'
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 25px rgba(168,85,247,0.6)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 0 rgba(168,85,247,0)'}
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Links grid — centered on mobile, side-by-side on larger screens */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-14 text-center md:text-left">

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center md:items-start"
          >
            <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-4 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full hidden md:block" />
              Services
            </h3>
            <ul className="space-y-3">
              {links.services.map((link, i) => (
                <motion.li key={link.label} whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-transparent hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-400 hover:bg-clip-text text-sm transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center md:items-start"
          >
            <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-4 bg-gradient-to-b from-cyan-400 to-blue-400 rounded-full hidden md:block" />
              Company
            </h3>
            <ul className="space-y-3">
              {links.company.map((link) => (
                <motion.li key={link.label} whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-transparent hover:bg-gradient-to-r hover:from-cyan-400 hover:to-blue-400 hover:bg-clip-text text-sm transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact info — spans 2 cols on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="col-span-2 md:col-span-2 flex flex-col items-center md:items-start"
          >
            <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-4 bg-gradient-to-b from-pink-400 to-orange-400 rounded-full hidden md:block" />
              Get In Touch
            </h3>
            <ul className="space-y-3 w-full max-w-xs">
              {links.contact.map((item) => (
                <li key={item.label}>
                  <motion.a
                    href={item.href}
                    whileHover={{ scale: 1.03 }}
                    className="group flex items-center justify-center md:justify-start gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-purple-500/30 transition-all duration-300"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600/30 to-pink-600/30 flex items-center justify-center group-hover:from-purple-600/50 group-hover:to-pink-600/50 transition-all flex-shrink-0">
                      <item.icon className="w-4 h-4 text-purple-300" />
                    </div>
                    <span className="text-gray-400 group-hover:text-white text-sm transition-colors">{item.label}</span>
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col items-center gap-5">
          {/* Glowing scroll-to-top button */}
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.15, y: -4 }}
            whileTap={{ scale: 0.9 }}
            animate={{ boxShadow: ['0 0 15px rgba(168,85,247,0.3)', '0 0 30px rgba(168,85,247,0.6)', '0 0 15px rgba(168,85,247,0.3)'] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gray-600 text-xs text-center"
          >
            <span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text font-semibold">
              © {new Date().getFullYear()} CreataLab.
            </span>{' '}
            All rights reserved. Built with creativity & data.
          </motion.p>
        </div>
      </div>
    </footer>
  );
}
