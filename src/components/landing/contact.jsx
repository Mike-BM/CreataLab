import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Phone, MapPin, ArrowRight, CheckCircle, MessageSquare } from 'lucide-react';
import { FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Textarea } from '@/ui/textarea';
import { toast } from 'sonner';
import { appConfig } from '@/lib/config';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    website: '' // honeypot
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const recaptchaRef = useRef(null);

  const validateForm = (data) => {
    const trimmed = {
      name: data.name.trim(),
      email: data.email.trim(),
      subject: data.subject.trim(),
      message: data.message.trim(),
    };

    if (trimmed.name.length < 2) return 'Please enter your full name.';
    if (trimmed.name.length > 100) return 'Name is too long (max 100).';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed.email)) return 'Please enter a valid email address.';
    if (trimmed.email.length > 100) return 'Email is too long (max 100).';
    if (trimmed.subject.length < 3) return 'Subject should be at least 3 characters.';
    if (trimmed.subject.length > 200) return 'Subject is too long (max 200).';
    if (trimmed.message.length < 10) return 'Message should be at least 10 characters.';
    if (trimmed.message.length > 5000) return 'Message is too long (max 5000).';

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (formData.website) {
        console.warn('Honeypot triggered');
        toast.success("Message sent successfully!");
        setFormData({ name: '', email: '', subject: '', message: '', website: '' });
        setIsSubmitting(false);
        return;
      }

      const error = validateForm(formData);
      if (error) {
        toast.error(error);
        setIsSubmitting(false);
        return;
      }

      let recaptchaToken = null;
      if (typeof window.grecaptcha !== 'undefined') {
        recaptchaToken = await window.grecaptcha.execute(appConfig.recaptcha.siteKey, { action: 'submit_contact' });
      }

      const safeData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        recaptchaToken,
        website: formData.website
      };

      if (!appConfig.api.contact) {
        console.warn('No contact API configured. Running in demo mode.');
        await new Promise(r => setTimeout(r, 1000));
      } else {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(appConfig.api.contact, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(safeData),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to send message');
        }
      }

      setIsSubmitted(true);
      toast.success("Message sent successfully! We'll get back to you soon.");

      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', subject: '', message: '', website: '' });
      }, 3000);
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error.message || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email Us",
      value: "hellocreatalab@gmail.com",
      href: "mailto:hellocreatalab@gmail.com"
    },
    {
      icon: Phone,
      label: "Call Us",
      value: "0753 436 729",
      href: "tel:0753436729"
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Nairobi, Kenya",
      href: "#"
    }
  ];

  const socialLinks = [
    { icon: FaTiktok, href: "https://www.tiktok.com/@creatalab_ltd", label: "TikTok" },
    { icon: FaInstagram, href: "https://www.instagram.com/creatalab?igsh=NjM5cG9yajJhdzE1", label: "Instagram" },
  ];

  return (
    <section id="contact" className="py-32 bg-background relative overflow-visible z-10">

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-accent/10 text-accent-hover border border-accent/20 text-xs font-bold tracking-widest uppercase mb-6"
          >
            <Mail className="w-4 h-4" />
            Get In Touch
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight tracking-tight"
          >
            Let's Make <span className="text-accent">Noise</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-muted text-lg font-normal max-w-2xl mx-auto leading-relaxed"
          >
            Stop whispering. If you want a brand that screams quality and demands attention, hit us up. Let's build something beautiful.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-16 items-start">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-8"
          >
            <div className="space-y-4">
              {contactInfo.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  className="group relative flex items-center gap-6 p-6 rounded-3xl border border-border bg-surface hover:shadow-soft hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="text-muted text-xs font-bold uppercase tracking-widest mb-1">{item.label}</div>
                    <div className="text-foreground font-bold text-lg">{item.value}</div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-muted group-hover:text-accent group-hover:translate-x-2 transition-transform duration-300" />
                </motion.a>
              ))}
            </div>

            {/* Brutalist WhatsApp CTA */}
            <motion.a
              href="https://wa.me/254793706054"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-between w-full p-6 rounded-3xl border border-border bg-[#25D366]/10 text-foreground transition-all duration-300 hover:shadow-soft hover:-translate-y-1"
            >
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-[#25D366] flex items-center justify-center text-white">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-muted text-xs font-bold uppercase tracking-widest">Quick Response</div>
                  <div className="font-bold text-xl uppercase">WhatsApp Us</div>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-[#25D366] group-hover:translate-x-2 transition-transform relative z-10" />
            </motion.a>

            {/* Social Media */}
            <div className="p-6 rounded-3xl border border-border bg-surface mt-8">
              <p className="text-accent text-xs font-bold uppercase tracking-widest mb-4">
                Connect with us online
              </p>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent hover:bg-accent hover:text-white transition-colors duration-300"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <form
              onSubmit={handleSubmit}
              className="p-8 md:p-12 rounded-3xl border border-border bg-surface shadow-soft relative space-y-8"
            >
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-foreground">
                    Your Name
                  </label>
                  <Input
                    placeholder="eliza"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent transition-all w-full"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-foreground">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="elizaexample@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent transition-all w-full"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-foreground">
                  Subject
                </label>
                <Input
                  placeholder="I need a killer website"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent transition-all w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-foreground">
                  Message
                </label>
                <Textarea
                  placeholder="Tell us everything..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground min-h-[180px] resize-none focus:outline-none focus:border-accent transition-all w-full"
                  required
                />
              </div>

              {/* Honeypot field (hidden from users) */}
              <div style={{ display: 'none' }} aria-hidden="true">
                <Input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  tabIndex="-1"
                  autoComplete="off"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || isSubmitted}
                className={`w-full py-6 rounded-full font-bold uppercase tracking-widest text-sm transition-all duration-300 ${isSubmitted
                  ? 'bg-[#25D366] text-white'
                  : 'bg-accent text-white hover:bg-accent-hover shadow-soft hover:shadow-md'
                  }`}
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Sending...</span>
                ) : isSubmitted ? (
                  <div className="flex items-center justify-center gap-3">
                    <CheckCircle className="w-5 h-5" />
                    <span>Message Sent!</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3 group">
                    <span>Send Message</span>
                    <Send className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </div>
                )}
              </Button>
            </form>
          </motion.div>
        </div>

        {/* How We Work Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-40"
        >
          <div className="text-center mb-24">
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 uppercase tracking-tight">
              Our <span className="text-accent">Process</span>
            </h3>
            <p className="text-muted text-lg mt-6">A framework that actually works.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-12 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 z-0" />
            
            {[
              { step: "01", title: "Discovery", desc: "We interrogate you until we understand." },
              { step: "02", title: "Design", desc: "We sketch, refine, and perfect." },
              { step: "03", title: "Develop", desc: "Code that looks and performs perfectly." },
              { step: "04", title: "Deliver", desc: "Launch and celebrate." }
            ].map((item, i) => (
              <div key={item.step} className={`relative z-10 text-center bg-background py-4`}>
                <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center text-accent font-bold text-xl mx-auto mb-8 shadow-sm">
                  {item.step}
                </div>
                <h4 className="text-xl font-bold uppercase tracking-tight text-foreground mb-4">{item.title}</h4>
                <p className="text-muted font-normal leading-relaxed px-4">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}