import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, 
  MonitorPlay, 
  BarChart3, 
  Globe, 
  Sparkles,
  ArrowUpRight,
  Calendar
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
    gradient: "from-cyan-500 to-blue-600",
    bgGradient: "from-cyan-500/20 to-blue-600/20"
  },
  {
    id: 2,
    icon: Palette,
    title: "High-Impact Multi-Media",
    description: "Graphic design that demands a second look. Professional posters and high-fidelity banners engineered to broadcast your message with clarity and authority.",
    features: ["Bespoke Poster Design", "Event Brand Banners", "Marketing Visual Kits", "Digital Asset Design", "Social Presence Kits"],
    gradient: "from-purple-600 to-pink-600",
    bgGradient: "from-purple-600/20 to-pink-600/20"
  },
  {
    id: 3,
    icon: Sparkles,
    title: "Elite Brand Identity",
    description: "Build an identity that dominates the competition. We craft world-class logos and brand guidelines that give your business a permanent, professional voice.",
    features: ["Logo Architecture", "Elite Brand Guidelines", "Visual Strategy", "Industry-Leading UI/UX", "Trust-Building Design"],
    gradient: "from-violet-600 to-purple-600",
    bgGradient: "from-violet-600/20 to-purple-600/20"
  }
];

export default function Services() {
  const [activeService, setActiveService] = useState(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <section id="services" className="py-32 bg-[#111118] relative overflow-hidden">
      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
      {/* Background elements */}
      <div className="absolute top-1/2 left-0 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-purple-600/5 rounded-full blur-[80px] md:blur-[150px] -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[200px] h-[200px] md:w-[400px] md:h-[400px] bg-cyan-600/5 rounded-full blur-[60px] md:blur-[100px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-cyan-400 text-sm font-medium tracking-wider uppercase mb-4 block">
            What We Do
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Services That
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"> Transform</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
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
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-full px-8 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105 transition-all"
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

              <div className="relative p-8 md:p-10 rounded-3xl border border-white/10 bg-[#0a0a0f]/80 backdrop-blur-sm h-full transition-all duration-500 group-hover:border-white/20">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} p-0.5 shrink-0`}>
                    <div className="w-full h-full bg-[#0a0a0f] rounded-2xl flex items-center justify-center group-hover:bg-transparent transition-colors duration-500">
                      <service.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-2xl font-semibold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all">
                        {service.title}
                      </h3>
                      <ArrowUpRight className="w-5 h-5 text-gray-500 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                    </div>
                    
                    <p className="text-gray-400 mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2">
                      {service.features.map((feature) => (
                        <span
                          key={feature}
                          className="px-3 py-1.5 text-xs font-medium text-gray-300 bg-white/5 rounded-full border border-white/10 group-hover:border-white/20 transition-colors"
                        >
                          {feature}
                        </span>
                      ))}
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