import { motion } from 'framer-motion';
import { Lightbulb, Target, Rocket, Users } from 'lucide-react';

const values = [
  {
    icon: Lightbulb,
    title: "Innovation First",
    description: "We blend creativity with cutting-edge technology to deliver solutions that stand out.",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: Target,
    title: "Data-Driven",
    description: "Every design decision is backed by insights, ensuring measurable impact.",
    gradient: "from-cyan-500 to-blue-500"
  },
  {
    icon: Rocket,
    title: "Future Ready",
    description: "We embrace emerging tools and AI to keep your brand ahead of the curve.",
    gradient: "from-pink-500 to-orange-500"
  },
  {
    icon: Users,
    title: "Client Focused",
    description: "Your vision drives our work. We collaborate closely to bring ideas to life.",
    gradient: "from-green-500 to-cyan-500"
  }
];

export default function About() {
  return (
    <section id="about" className="py-32 bg-[#0a0a0f] relative">
      {/* Subtle gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <span className="text-purple-400 text-sm font-medium tracking-wider uppercase mb-4 block">
            About Us
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            A Creative Lab for the
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"> Digital Age</span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            CreataLab is where ideas transform into reality. We're a young, innovative team 
            passionate about helping brands communicate clearly and beautifully through 
            design, data, and digital craftsmanship.
          </p>
        </motion.div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
              whileHover={{ y: -12, transition: { duration: 0.3 } }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-8 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-sm h-full">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${value.gradient} p-0.5 mb-6`}>
                  <div className="w-full h-full bg-[#0a0a0f] rounded-2xl flex items-center justify-center">
                    <value.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                <p className="text-gray-400 leading-relaxed">{value.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-cyan-600/20 rounded-3xl blur-xl" />
          <div className="relative p-10 md:p-16 rounded-3xl border border-white/10 bg-[#111118]/80 backdrop-blur-sm text-center">
            <p className="text-2xl md:text-3xl text-white font-light leading-relaxed">
              "We believe every idea deserves a 
              <span className="text-purple-400 font-medium"> beautiful presentation</span> and every 
              <span className="text-cyan-400 font-medium"> decision</span> deserves 
              <span className="text-pink-400 font-medium"> clear insights</span>."
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-purple-500" />
              <span className="text-gray-400">CreataLab Team</span>
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-cyan-500" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}