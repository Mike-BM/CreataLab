import { Lightbulb, Target, Rocket, Users } from 'lucide-react';
import { Button } from '@/ui/button';
import { appConfig } from '@/lib/config';
import { motion } from 'framer-motion';

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
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Built Different,
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent"> Designed Better</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto font-medium mb-8">
            Worked with organizations and clients to deliver creative digital solutions that solve real problems.
          </p>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-12">
            creatalab is where ideas transform into reality. We're a young, innovative team 
            passionate about helping brands communicate clearly and beautifully through 
            design, data, and digital craftsmanship.
          </p>

          {/* Social Proof Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto py-8 border-y border-white/5">
            {[
              { label: 'Projects Completed', value: '90+', color: 'text-purple-400' },
              { label: 'Happy Clients', value: '40+', color: 'text-cyan-400' },
              { label: 'Creative Assets', value: '500+', color: 'text-pink-400' },
              { label: 'Data Insights', value: '1M+', color: 'text-blue-400' }
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className={`text-4xl md:text-5xl font-black mb-2 ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-[10px] md:text-xs font-black text-gray-500 uppercase tracking-widest">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
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
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-cyan-600/10 md:from-purple-600/20 md:via-pink-600/20 md:to-cyan-600/20 rounded-3xl blur-lg md:blur-xl" />
          <div className="relative p-10 md:p-16 rounded-3xl border border-white/10 bg-[#111118]/80 backdrop-blur-sm text-center">
            <p className="text-2xl md:text-3xl text-white font-light leading-relaxed mb-10">
              "We believe every idea deserves a 
              <span className="text-purple-400 font-medium"> beautiful presentation</span> and every 
              <span className="text-cyan-400 font-medium"> decision</span> deserves 
              <span className="text-pink-400 font-medium"> clear insights</span>."
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Button
                size="lg"
                onClick={() => {
                  const section = document.querySelector('#contact');
                  if (section) section.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-purple-600 hover:bg-purple-500 text-white rounded-full px-8 h-14 font-bold"
              >
                Start Your Project
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.open(appConfig.socialLinks.whatsapp, '_blank')}
                className="border-white/20 text-white hover:bg-white/5 rounded-full px-8 h-14 font-bold"
              >
                Contact Me
              </Button>
            </div>

            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-purple-500" />
              <span className="text-gray-400">creatalab Team</span>
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-cyan-500" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}