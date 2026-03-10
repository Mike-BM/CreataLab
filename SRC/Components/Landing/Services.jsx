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
import { Button } from '@/UI/button';
import BookingModal from './BookingModal';

const services = [
  {
    id: 1,
    icon: Palette,
    title: "Brand Identity & Graphic Design",
    description: "Complete visual brand systems that make your business unforgettable. From logos to merchandise, we craft every touchpoint.",
    features: ["Logo Design", "Visual Identity", "Merchandise", "Brand Guidelines"],
    gradient: "from-purple-600 to-pink-600",
    bgGradient: "from-purple-600/20 to-pink-600/20"
  },
  {
    id: 2,
    icon: MonitorPlay,
    title: "Digital & Media Design",
    description: "Eye-catching visuals for the digital world. Social media graphics, marketing creatives, and video content that engages.",
    features: ["Social Media Graphics", "Marketing Creatives", "Ad Campaigns", "Video Editing", "Motion Graphics"],
    gradient: "from-pink-600 to-orange-500",
    bgGradient: "from-pink-600/20 to-orange-500/20"
  },
  {
    id: 3,
    icon: BarChart3,
    title: "Data Analysis & Visual Insights",
    description: "Transform complex data into clear, actionable insights. Beautiful dashboards and reports that drive decisions.",
    features: ["Data Visualization", "Interactive Dashboards", "Report Design", "Analytics Setup", "Insight Reports"],
    gradient: "from-cyan-500 to-blue-600",
    bgGradient: "from-cyan-500/20 to-blue-600/20"
  },
  {
    id: 4,
    icon: Globe,
    title: "Web & Digital Solutions",
    description: "Professional websites that convert. From portfolios to business platforms, built for performance and beauty.",
    features: ["Business Websites", "Landing Pages", "Portfolio Sites", "Performance Optimization", "Web Maintenance"],
    gradient: "from-green-500 to-cyan-500",
    bgGradient: "from-green-500/20 to-cyan-500/20"
  },
  {
    id: 5,
    icon: Sparkles,
    title: "AI-Assisted Solutions",
    description: "Leverage cutting-edge AI tools to enhance workflows, automate tasks, and unlock new creative possibilities.",
    features: ["AI Integration", "Workflow Automation", "Smart Design Tools", "Content Generation", "Process Optimization"],
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
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[150px] -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-[100px]" />

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
              className={`group relative cursor-pointer ${index === 4 ? 'lg:col-span-2 lg:max-w-2xl lg:mx-auto' : ''}`}
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