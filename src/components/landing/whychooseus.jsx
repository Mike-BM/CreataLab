import { motion } from 'framer-motion';
import { Zap, Heart, DollarSign, RefreshCw, Quote } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: "Results-Driven",
    description: "We deliver solutions that create real impact, not just pretty pictures."
  },
  {
    icon: Heart,
    title: "Passionate Craft",
    description: "Every project receives our full obsessive dedication and sleep-deprived attention."
  },
  {
    icon: DollarSign,
    title: "Transparent Pricing",
    description: "Premium quality work that actually respects your budget constraints."
  },
  {
    icon: RefreshCw,
    title: "Agile AF",
    description: "Quick turnarounds and flexible processes that evolve as fast as you do."
  }
];

const testimonials = [
  {
    quote: "creatalab transformed our brand completely. The results exceeded every expectation. I don't know when they sleep.",
    author: "Catherine M",
    role: "Founder"
  },
  {
    quote: "Their data visualization made our reports actually readable. Game-changing for our presentations. No more boring pie charts.",
    author: "James K.",
    role: "NGO Employee"
  },
  {
    quote: "Fast, creative, and genuinely cared about our project. They broke the rules in the best way possible.",
    author: "John Michael",
    role: "Business Owner"
  }
];

const stats = [
  { value: "21+", label: "Projects Shipped" },
  { value: "30+", label: "Happy Clients" },
  { value: "98%", label: "Satisfaction" },
  { value: "24h", label: "Response Time" }
];

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="py-32 bg-surface relative overflow-hidden">


      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <span className="text-accent text-sm font-bold tracking-widest uppercase mb-4 block">
            The Hard Truth
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight tracking-tight">
            Built Different,<br/>
            <span className="text-accent">Designed Better</span>
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto font-normal leading-[1.7]">
            We don't use templates. We don't do 'safe'. We build high-impact digital experiences for brands that want to stand out.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`group p-8 rounded-3xl border border-border bg-background hover:bg-surface hover:shadow-soft transition-all duration-300`}
            >
              <div className="w-16 h-16 mb-6 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-32"
        >
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`p-8 rounded-3xl bg-accent/10 text-center hover:-translate-y-2 transition-transform duration-300`}
            >
              <div className="text-5xl md:text-6xl font-bold mb-2 text-accent">
                {stat.value}
              </div>
              <div className="text-foreground/80 text-sm font-semibold uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <div className="relative">
          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-3xl border border-border bg-background h-full flex flex-col justify-between hover:-translate-y-2 transition-all duration-300 hover:shadow-soft"
              >
                <Quote className="w-8 h-8 text-accent/20 mb-6" />
                <p className="text-foreground font-medium text-lg mb-8 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xl">
                    {testimonial.author[0]}
                  </div>
                  <div>
                    <div className="text-foreground font-bold tracking-tight text-sm">{testimonial.author}</div>
                    <div className="text-muted text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
