import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Phone, MessageCircle, MapPin, ArrowRight, CheckCircle } from 'lucide-react';
import { FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';
import { Button } from '@/UI/button';
import { Input } from '@/UI/input';
import { Textarea } from '@/UI/textarea';
import { toast } from 'sonner';
import { appConfig } from '@/Lib/config';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (data) => {
    const trimmed = {
      name: data.name.trim(),
      email: data.email.trim(),
      subject: data.subject.trim(),
      message: data.message.trim(),
    };

    if (trimmed.name.length < 2) return 'Please enter your full name.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmed.email)) return 'Please enter a valid email address.';
    if (trimmed.subject.length < 3) return 'Subject should be at least 3 characters.';
    if (trimmed.message.length < 10) return 'Message should be at least 10 characters.';
    if (trimmed.message.length > 2000) return 'Message is too long. Please keep it under 2000 characters.';

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const error = validateForm(formData);
      if (error) {
        toast.error(error);
        return;
      }

      const safeData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      };

      // If no secure backend is configured, simulate success in demo mode
      if (!appConfig.api.contact) {
        console.warn('No contact API configured. Running in demo mode.');
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

        if (!response.ok) throw new Error('Failed to send message');
      }

      setIsSubmitted(true);
      toast.success("Message sent successfully! We'll get back to you soon.");

      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }, 3000);
    } catch (error) {
      console.error('Submission error:', error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email Us",
      value: "hello@creatalab.com",
      href: "mailto:hello@creatalab.com"
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
    { icon: FaTiktok, href: "https://www.tiktok.com/@creatalab_ltd", label: "TikTok", color: "hover:text-purple-500" },
    { icon: FaInstagram, href: "https://www.instagram.com/creatalab?igsh=NjM5cG9yajJhdzE1", label: "Instagram", color: "hover:text-pink-500" },
    { icon: FaWhatsapp, href: "https://wa.me/254753436729?text=Thank%20you%20for%20contacting%20CreataLab...", label: "WhatsApp", color: "hover:text-green-500" },
  ];

  return (
    <section id="contact" className="py-32 bg-[#0a0a0f] relative overflow-hidden">
      {/* Enhanced Background elements with animation */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[180px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -40, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-600/15 rounded-full blur-[150px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[120px]"
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 text-purple-300 text-sm font-medium tracking-wider uppercase mb-6 backdrop-blur-sm shadow-[0_0_20px_rgba(168,85,247,0.2)]"
          >
            <Mail className="w-4 h-4" />
            Get In Touch
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Let's Create
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="inline-block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-gradient ml-2"
            >
              Together
            </motion.span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Ready to bring your ideas to life? Reach out and let's discuss how we can help transform your vision into reality.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">
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
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="group relative flex items-center gap-4 p-5 rounded-2xl border border-white/10 bg-gradient-to-r from-white/[0.03] to-white/[0.01] hover:from-white/[0.08] hover:to-white/[0.03] hover:border-white/30 transition-all duration-300 backdrop-blur-sm overflow-hidden"
                >
                  {/* Glow effect on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600/30 to-pink-600/30 flex items-center justify-center group-hover:from-purple-500/40 group-hover:to-pink-500/40 transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.2)] group-hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]"
                  >
                    <item.icon className="w-6 h-6 text-purple-300 relative z-10" />
                  </motion.div>
                  <div className="relative z-10 flex-1">
                    <div className="text-gray-400 text-sm font-medium mb-1">{item.label}</div>
                    <div className="text-white font-semibold text-base">{item.value}</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-300 relative z-10" />
                </motion.a>
              ))}
            </div>

            {/* Enhanced WhatsApp CTA */}
            <motion.a
              href="https://wa.me/254753436729?text=Thank%20you%20for%20contacting%20CreataLab..."
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group relative flex items-center justify-between w-full p-6 rounded-2xl bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 transition-all duration-300 shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:shadow-[0_0_50px_rgba(34,197,94,0.6)] overflow-hidden"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              />
              <div className="flex items-center gap-4 relative z-10">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
                >
                  <MessageCircle className="w-7 h-7 text-white" />
                </motion.div>
                <div>
                  <div className="text-white/90 text-sm font-medium">Quick Response</div>
                  <div className="text-white font-bold text-lg">Chat on WhatsApp</div>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-2 transition-transform relative z-10" />
            </motion.a>

            {/* Enhanced Social Media */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-sm"
            >
              <p className="text-purple-300 text-sm font-semibold mb-5 flex items-center gap-2">
                <span className="w-1 h-4 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full" />
                Connect with us on social media
              </p>
              <div className="grid grid-cols-3 gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.15, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative h-14 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/30 flex items-center justify-center text-gray-400 ${social.color} transition-all overflow-hidden group`}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    <social.icon className="w-6 h-6 relative z-10 group-hover:scale-110 transition-transform" />
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100"
                    />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-cyan-600/20 rounded-3xl blur-xl" />
              <form
                onSubmit={handleSubmit}
                className="relative p-8 md:p-10 rounded-3xl border border-white/10 bg-[#111118]/80 backdrop-blur-sm space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="text-gray-300 text-sm font-medium mb-3 block flex items-center gap-2">
                      <span className="w-1 h-4 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full" />
                      Your Name
                    </label>
                    <Input
                      placeholder="Brian Michael"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-14 rounded-xl focus:border-purple-500 focus:ring-purple-500/30 focus:bg-white/10 transition-all duration-300 hover:border-white/20"
                      required
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="text-gray-300 text-sm font-medium mb-3 block flex items-center gap-2">
                      <span className="w-1 h-4 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full" />
                      Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="example@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-14 rounded-xl focus:border-purple-500 focus:ring-purple-500/30 focus:bg-white/10 transition-all duration-300 hover:border-white/20"
                      required
                    />
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="text-gray-300 text-sm font-medium mb-3 block flex items-center gap-2">
                    <span className="w-1 h-4 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full" />
                    Subject
                  </label>
                  <Input
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-14 rounded-xl focus:border-purple-500 focus:ring-purple-500/30 focus:bg-white/10 transition-all duration-300 hover:border-white/20"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="text-gray-300 text-sm font-medium mb-3 block flex items-center gap-2">
                    <span className="w-1 h-4 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full" />
                    Message
                  </label>
                  <Textarea
                    placeholder="Tell us about your project..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 min-h-[180px] rounded-xl resize-none focus:border-purple-500 focus:ring-purple-500/30 focus:bg-white/10 transition-all duration-300 hover:border-white/20"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={isSubmitting || isSubmitted}
                    className={`relative w-full h-16 rounded-xl text-lg font-bold transition-all duration-300 overflow-hidden ${isSubmitted
                      ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 hover:shadow-[0_0_50px_rgba(168,85,247,0.5)]'
                      }`}
                  >
                    <motion.div
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    />
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-3 relative z-10">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full"
                        />
                        <span>Sending...</span>
                      </div>
                    ) : isSubmitted ? (
                      <div className="flex items-center justify-center gap-3 relative z-10">
                        <CheckCircle className="w-6 h-6" />
                        <span>Message Sent!</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-3 relative z-10">
                        <Send className="w-6 h-6" />
                        <span>Send Message</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    )}
                  </Button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
