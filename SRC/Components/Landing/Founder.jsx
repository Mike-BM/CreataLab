import { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, BarChart3, Globe, Sparkles, ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/UI/button';
import BookingModal from './BookingModal';

const timeline = [
  {
    year: "2023",
    icon: Palette,
    title: "Design",
    description: "Started with graphic design and brand identity",
    color: "from-purple-500 to-pink-500"
  },
  {
    year: "2024",
    icon: BarChart3,
    title: "Data",
    description: "Expanded into data visualization and analytics",
    color: "from-cyan-500 to-blue-500"
  },
  {
    year: "2025",
    icon: Globe,
    title: "Web",
    description: "Developed web solutions and digital platforms",
    color: "from-green-500 to-cyan-500"
  },
  {
    year: "2025",
    icon: Sparkles,
    title: "AI",
    description: "Integrated AI tools and automation workflows",
    color: "from-violet-500 to-purple-500"
  }
];

const techStack = [
  {
    label: "Creative Design",
    icon: Palette,
    description: "Posters, brand systems, and visual storytelling.",
    tools: ["Figma", "Adobe Illustrator", "Photoshop", "After Effects"],
  },
  {
    label: "Data Analysis",
    icon: BarChart3,
    description: "From raw datasets to decision-ready dashboards.",
    tools: ["Python", "RStudio", "SQL", "Power BI", "Excel", "Tableau"],
  },
  {
    label: "Web Development",
    icon: Globe,
    description: "Modern, performant websites and web platforms.",
    tools: ["React", "Vite", "Tailwind CSS", "Node.js", "REST APIs"],
  },
  {
    label: "AI Integration",
    icon: Sparkles,
    description: "Practical AI flows embedded in real products.",
    tools: ["OpenAI APIs", "LLM Workflows", "Prompt Engineering", "Automation Scripts"],
  },
];

export default function Founder() {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <section className="py-32 bg-[#0a0a0f] relative overflow-hidden">
      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
      {/* Background gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-purple-600/5 via-pink-600/5 to-cyan-600/5 rounded-full blur-[150px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <span className="text-purple-400 text-sm font-medium tracking-wider uppercase mb-4 block">
            Meet the Founder
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            The Creative Mind Behind
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> CreataLab</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-pink-600/30 to-cyan-600/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/10">
              <img
                src="/images/founder-brian-michael.png"
                alt="Brian Michael – Founder of CreataLab"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <h3 className="text-3xl font-bold text-white mb-2">Brian Michael</h3>
                <p className="text-purple-400 text-lg">Founder & Creative Director</p>
              </div>
            </div>
          </motion.div>

          {/* Story */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="space-y-4 text-gray-400 leading-relaxed">
              <p className="text-lg">
                What started as a passion for design in 2023 has evolved into a full-service creative-tech lab. 
                I founded CreataLab with a simple mission: help brands tell their stories beautifully and backed by data.
              </p>
              <p>
                Over the years, I've had the privilege of working with growing startups, NGOs, and Small businesses across Kenya 
                with an aim of reaching the global Market with my services, 
                helping them transform ideas into visual realities. From crafting brand identities to building data 
                dashboards and web platforms, every project teaches me something new.
              </p>
              <p>
                Today, CreataLab combines creativity, analytics, and cutting-edge technology to deliver solutions 
                that don't just look good—they perform. Whether it's a logo, a website, or an AI-powered workflow, 
                we're here to make your vision come alive.
              </p>
            </div>

            {/* Tech Stack & Tools */}
            <div className="space-y-4 pt-6">
              <h4 className="text-white font-semibold text-lg">Tech Stack & Tools</h4>
              <p className="text-sm text-gray-400">
                Instead of vague percentages, here&apos;s what I actually use with clients across Kenya and beyond.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {techStack.map((area) => (
                  <motion.div
                    key={area.label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                        <area.icon className="w-4 h-4 text-purple-300" />
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold text-white">{area.label}</h5>
                        <p className="text-xs text-gray-400">{area.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {area.tools.map((tool) => (
                        <span
                          key={tool}
                          className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-[0.7rem] text-gray-200"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                onClick={() => {
                  const contactSection = document.querySelector('#contact');
                  if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-full px-6"
              >
                Reach Out
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setBookingOpen(true)}
                className="border-white/20 text-white hover:bg-white/5 rounded-full px-6"
              >
                <Calendar className="mr-2 w-4 h-4" />
                Book a Service
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Journey Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
            The Journey: From Design to AI
          </h3>

          {/* Timeline */}
          <div className="grid md:grid-cols-4 gap-6">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 rounded-2xl blur-xl transition-opacity duration-500`} />
                <div className="relative p-6 rounded-2xl border border-white/10 bg-white/[0.02] text-center h-full">
                  <div className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${item.color} p-0.5`}>
                    <div className="w-full h-full bg-[#0a0a0f] rounded-xl flex items-center justify-center group-hover:bg-transparent transition-colors duration-300">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-purple-400 text-sm font-medium mb-2">{item.year}</div>
                  <h4 className="text-white font-semibold text-lg mb-2">{item.title}</h4>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}