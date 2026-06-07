import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, 
  Globe, 
  Sparkles,
  ArrowUpRight,
  Calendar,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/ui/button';
import BookingModal from './bookingmodal.jsx';

const services = [
  {
    id: 1,
    icon: Globe,
    title: "High-Performance Web Solutions",
    description: "Your website should be your #1 salesperson. We build custom, conversion-focused platforms that blend elite aesthetics with secure, scalable performance to grow your business.",
    features: ["Business Platforms", "Dynamic Portfolios", "Booking Systems", "Performance Engine", "Mobile Optimization"],
    gradient: "from-accent to-accent-hover",
    bgGradient: "from-accent/20 to-accent-hover/20"
  },
  {
    id: 2,
    icon: Palette,
    title: "High-Impact Multi-Media",
    description: "Graphic design that demands a second look. Professional posters and high-fidelity banners engineered to broadcast your message with clarity and authority.",
    features: ["Bespoke Poster Design", "Event Brand Banners", "Marketing Visual Kits", "Digital Asset Design", "Social Presence Kits"],
    gradient: "from-secondary to-accent",
    bgGradient: "from-secondary/20 to-accent/20"
  },
  {
    id: 3,
    icon: Sparkles,
    title: "Elite Brand Identity",
    description: "Build an identity that dominates the competition. We craft world-class logos and brand guidelines that give your business a permanent, professional voice.",
    features: ["Logo Architecture", "Elite Brand Guidelines", "Visual Strategy", "Industry-Leading UI/UX", "Trust-Building Design"],
    gradient: "from-accent-hover to-secondary",
    bgGradient: "from-accent-hover/20 to-secondary/20"
  }
];

export default function Services() {
  const [activeService, setActiveService] = useState(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <section id="services" className="py-32 bg-background relative overflow-hidden">
      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
      {/* Background elements */}
      <div className="absolute top-1/2 left-0 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-accent/5 rounded-full blur-[80px] md:blur-[150px] -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[200px] h-[200px] md:w-[400px] md:h-[400px] bg-secondary/10 rounded-full blur-[60px] md:blur-[100px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-accent text-sm font-bold tracking-wider uppercase mb-4 block">
            What We Do
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            Services That
            <span className="text-accent"> Transform</span>
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            From brand creation to data visualization, we offer comprehensive solutions 
            tailored to your unique needs.
          </p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-8"
          >
            <Button
              onClick={() => setBookingOpen(true)}
              size="lg"
              className="bg-accent hover:bg-accent-hover text-white rounded-full px-8 shadow-soft hover:shadow-md transition-all"
            >
              <Calendar className="mr-2 w-5 h-5" />
              Book a Service Now
            </Button>
          </motion.div>
        </motion.div>

        {/* Services Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setActiveService(service.id)}
              onMouseLeave={() => setActiveService(null)}
              className="group relative cursor-pointer"
            >
              {/* Hover glow */}
              <AnimatePresence>
                {activeService === service.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`absolute -inset-1 bg-gradient-to-r ${service.bgGradient} rounded-3xl blur-xl`}
                  />
                )}
              </AnimatePresence>

              <div className="relative p-8 md:p-10 rounded-3xl border border-border bg-surface h-full transition-all duration-500 group-hover:shadow-soft">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.bgGradient} flex items-center justify-center shrink-0`}>
                    <service.icon className="w-7 h-7 text-accent" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold text-foreground transition-all">
                        {service.title}
                      </h3>
                      <ArrowUpRight className="w-5 h-5 text-muted group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <p className="text-muted text-sm leading-relaxed border-l-2 border-accent/30 pl-4">
                        {service.description}
                      </p>
                      <ul className="space-y-2.5">
                        {service.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-3 text-foreground/80 text-sm font-medium">
                            <CheckCircle className="w-4 h-4 text-accent shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}