import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, ShieldCheck, User, Mail } from 'lucide-react';
import { Button } from '@/ui/button';
import { toast } from 'sonner';
import { appConfig } from '@/lib/config';

export default function Feedback() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.target);
    const name = formData.get('name')?.trim();
    const email = formData.get('email')?.trim() || '';
    const message = formData.get('message');

    // Make Email completely optional in the payload
    const emailText = email ? `\n*Email:* ${email}` : '';
    const textPayload = `*Confidential Feedback*\n\n*Name:* ${name}${emailText}\n\n*Message:*\n${message}`;

    try {
      // 1. Grab the WhatsApp base URL from config (e.g. https://wa.me/something )
      const whatsappBaseUrl = appConfig.socialLinks.whatsapp || 'https://wa.me/254753436729';
      
      // 2. Append the text safely
      const url = new URL(whatsappBaseUrl);
      url.searchParams.set('text', textPayload);

      // 3. Open WhatsApp
      window.open(url.toString(), '_blank');
      
      toast.success('Redirecting to WhatsApp...', {
        description: 'You can now securely send your comment.',
      });
      e.target.reset();
    } catch (error) {
      toast.error('Submission failed', { description: 'Please try again later. Make sure WhatsApp is installed.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-[#050508] relative overflow-hidden flex items-center justify-center min-h-[80vh]">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/70 text-sm mb-6">
            <ShieldCheck size={16} className="text-purple-400" />
            <span>100% Confidential</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Leave a <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Comment</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Have a suggestion, idea, or general feedback? Drop it here. Only our admin team can read this securely.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm max-w-2xl mx-auto"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                  <User size={14} /> Name
                </label>
                <input 
                  type="text" 
                  name="name"
                  required
                  placeholder="John Doe"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                  <Mail size={14} /> Email <span className="text-white/30 text-xs">(Optional)</span>
                </label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="anonymous@example.com"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                <MessageSquare size={14} /> Your Comment
              </label>
              <textarea 
                name="message"
                required
                rows={4}
                placeholder="What's on your mind?..."
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
              />
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-white text-black hover:bg-white/90 rounded-xl py-6 text-base font-semibold group"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  Submit Securely
                  <Send size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
