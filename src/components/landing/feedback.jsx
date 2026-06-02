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

    const emailText = email ? `\n*Email:* ${email}` : '';
    const textPayload = `*Confidential Feedback*\n\n*Name:* ${name}${emailText}\n\n*Message:*\n${message}`;

    try {
      const whatsappBaseUrl = appConfig.socialLinks.whatsapp || 'https://wa.me/254793706054';
      const url = new URL(whatsappBaseUrl);
      url.searchParams.set('text', textPayload);

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
    <section id="feedback" className="py-24 bg-surface relative overflow-hidden flex items-center justify-center min-h-[80vh] z-10">

      <div className="container mx-auto px-6 max-w-4xl relative z-10 flex flex-col md:flex-row gap-12 items-center">
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-left w-full md:w-1/2"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent-hover text-xs font-bold uppercase tracking-widest mb-6">
            <ShieldCheck size={16} />
            <span>100% Confidential</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight tracking-tight">
            Tell Us<br/>
            What You <span className="text-accent">Think</span>
          </h2>
          <p className="text-muted text-lg font-normal leading-[1.7] max-w-md">
            Got a crazy idea? Spotted a kerning error? Or just want to say hi? Drop it here. We read everything.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="w-full md:w-1/2 bg-background p-8 rounded-3xl shadow-soft border border-border relative"
        >
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                  <User size={14} className="text-accent" /> Name
                </label>
                <input 
                  type="text" 
                  name="name"
                  required
                  placeholder="eliza"
                  className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                  <Mail size={14} className="text-secondary-foreground" /> Email <span className="text-muted">(Optional)</span>
                </label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="elizaexample@gmail.com"
                  className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                <MessageSquare size={14} className="text-accent" /> Message
              </label>
              <textarea 
                name="message"
                required
                rows={4}
                placeholder="What's on your mind?"
                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-none"
              />
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-accent text-white hover:bg-accent-hover rounded-full py-6 shadow-soft hover:shadow-md text-sm font-bold uppercase tracking-widest group transition-all"
            >
              {isSubmitting ? (
                <span className="animate-pulse">Sending...</span>
              ) : (
                <span className="flex items-center gap-2">
                  Send Message
                  <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
