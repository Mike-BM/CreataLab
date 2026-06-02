import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const links = {
    services: [
      { label: "Website Design", href: "#services" },
      { label: "Graphic Design", href: "#services" },
      { label: "Branding", href: "#services" },
      { label: "Data Analysis", href: "#services" },
      { label: "AI Solutions", href: "#services" },
    ],
    company: [
      { label: "About Us", href: "#about" },
      { label: "Portfolio", href: "#portfolio" },
      { label: "Contact", href: "#contact" },
    ],
    social: [
      { icon: FaTiktok, href: "https://www.tiktok.com/@creatalab_ltd", label: "TikTok" },
      { icon: FaInstagram, href: "https://www.instagram.com/creatalab?igsh=NjM5cG9yajJhdzE1", label: "Instagram" },
      { icon: FaWhatsapp, href: "https://wa.me/254793706054", label: "WhatsApp" },
    ]
  };

  return (
    <footer className="bg-surface pt-16 pb-8 border-t border-border relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between gap-16 mb-16">
          {/* Brand */}
          <div className="max-w-md">
            <div className="text-3xl font-bold tracking-tight mb-4 text-foreground">
              CREATA<span className="text-[#38bdf8]">LAB</span>
            </div>
            <p className="text-muted mb-8 leading-relaxed font-normal">
              A creative-tech lab helping brands communicate ideas through stunning design, actionable data insights, and cutting-edge digital solutions.
            </p>
            <div className="flex flex-wrap gap-4">
              {links.social.map((social, index) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent hover:bg-accent hover:text-white transition-all duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="flex gap-16">
            {/* Services Links - Messy Stack */}
            <div>
              <h3 className="text-foreground font-bold uppercase tracking-widest mb-6">Services</h3>
              <ul className="space-y-4">
                {links.services.map((link, i) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-muted hover:text-accent font-semibold transition-colors duration-300 inline-block hover:-translate-y-1 transform"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-foreground font-bold uppercase tracking-widest mb-6">Company</h3>
              <ul className="space-y-4">
                {links.company.map((link, i) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-muted hover:text-accent font-semibold transition-colors duration-300 inline-block hover:-translate-y-1 transform"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-border mb-8" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted text-sm font-semibold uppercase tracking-widest">
            © {new Date().getFullYear()} creatalab. All rights reserved.
          </p>

          <button
            onClick={scrollToTop}
            className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent hover:bg-accent hover:text-white transition-colors"
          >
            <ArrowUp className="w-6 h-6" />
          </button>
        </div>
      </div>
    </footer>
  );
}