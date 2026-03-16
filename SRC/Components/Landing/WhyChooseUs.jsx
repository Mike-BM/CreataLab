import { motion } from 'framer-motion';
import { Zap, Heart, DollarSign, RefreshCw, Quote } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: "Youth-Driven Innovation",
    description: "Fresh perspectives and bold ideas that push creative boundaries."
  },
  {
    icon: Heart,
    title: "Passionate Craftsmanship",
    description: "Every project receives our full creative dedication and attention."
  },
  {
    icon: DollarSign,
    title: "Affordable Excellence",
    description: "Premium quality solutions that respect your budget constraints."
  },
  {
    icon: RefreshCw,
    title: "Adaptable & Agile",
    description: "Quick turnarounds and flexible processes that evolve with you."
  }
];

const testimonials = [
  {
    quote: "creatalab transformed our brand identity completely. The results exceeded every expectation.",
    author: "Christopher Kasiva.",
    role: "Founder"
  },
  {
    quote: "Their data visualization made our reports actually readable. Game-changing for our presentations.",
    author: "James K.",
    role: "NGO Employee"
  },
  {
    quote: "Fast, creative, and genuinely cared about our project. Highly recommended!",
    author: "Florency Muthina.",
    role: "Business Owner"
  }
];

const stats = [
  { value: "21+", label: "Projects Delivered" },
  { value: "30+", label: "Happy Clients" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "24h", label: "Avg. Response Time" }
];

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="py-32 bg-[#111118] relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-cyan-600/10 rounded-full blur-[150px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-green-400 text-sm font-medium tracking-wider uppercase mb-4 block">
            Why creatalab
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Built Different,
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent"> Designed Better</span>
          </h2>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group text-center p-8"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-500/20 to-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-cyan-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
              <div className="relative p-8 rounded-2xl border border-white/10 bg-white/[0.02] text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-8 rounded-3xl border border-white/10 bg-[#0a0a0f]/50 h-full">
                <Quote className="w-8 h-8 text-purple-500/30 mb-4" />
                <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                    {testimonial.author[0]}
                  </div>
                  <div>
                    <div className="text-white font-medium">{testimonial.author}</div>
                    <div className="text-gray-500 text-sm">{testimonial.role}</div>
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
