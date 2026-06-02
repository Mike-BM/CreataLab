import { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, BarChart3, Globe, Sparkles, ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/ui/button';
import BookingModal from './bookingmodal.jsx';

const timeline = [
  {
    year: "2023",
    icon: Palette,
    title: "Design",
    description: "Started with graphic design and brand identity",
    color: "from-accent to-accent-hover"
  },
  {
    year: "2024",
    icon: BarChart3,
    title: "Data",
    description: "Expanded into data visualization and analytics",
    color: "from-secondary to-accent"
  },
  {
    year: "2025",
    icon: Globe,
    title: "Web",
    description: "Developed web solutions and digital platforms",
    color: "from-accent-hover to-secondary"
  },
  {
    year: "2025",
    icon: Sparkles,
    title: "AI",
    description: "Integrated AI tools and automation workflows",
    color: "from-secondary to-accent-hover"
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
    <section className="py-32 bg-background relative overflow-hidden border-b border-border">
      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
      {/* Background gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-accent/5 rounded-full blur-[150px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <span className="text-accent font-bold tracking-wider uppercase mb-4 block">
            Meet the Founder
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            The Creative Mind Behind
            <span className="text-accent"> creatalab</span>
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
            <div className="absolute inset-0 bg-accent/10 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-soft border border-border">
              <img
                src="/images/founder-muema.png"
                alt="Muema – Founder of creatalab"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <h3 className="text-3xl font-bold text-white mb-2">Muema</h3>
                <p className="text-white/80 font-medium text-lg">Founder & CEO</p>
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
            <div className="space-y-4 text-muted leading-relaxed">
              <p className="text-lg">
                What started as a passion for design in 2023 has evolved into a full-service creative-tech lab. 
                I founded creatalab with a simple mission: help brands tell their stories beautifully and backed by data.
              </p>
              <p>
                Over the years, I've had the privilege of working with growing startups, NGOs, and Small businesses across Kenya 
                with an aim of reaching the global Market with my services, 
                helping them transform ideas into visual realities. From crafting brand identities to building data 
                dashboards and web platforms, every project teaches me something new.
              </p>
              <p>
                Today, creatalab combines creativity, analytics, and cutting-edge technology to deliver solutions 
                that don't just look good—they perform. Whether it's a logo, a website, or an AI-powered workflow, 
                we're here to make your vision come alive.
              </p>
            </div>

            {/* Tech Stack & Tools */}
            <div className="space-y-4 pt-6">
              <h4 className="text-foreground font-bold text-xl">Tech Stack & Tools</h4>
              <p className="text-sm text-muted">
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
                    className="rounded-2xl border border-border bg-surface p-4 space-y-3 shadow-soft"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                        <area.icon className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-foreground">{area.label}</h5>
                        <p className="text-xs text-muted">{area.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {area.tools.map((tool) => (
                        <span
                          key={tool}
                          className="px-2 py-1 rounded-full bg-muted/10 border border-border text-[0.7rem] font-semibold text-foreground"
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
                className="bg-accent hover:bg-accent-hover shadow-soft hover:shadow-md text-white rounded-full px-6 font-bold"
              >
                Reach Out
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setBookingOpen(true)}
                className="border-border text-foreground hover:bg-muted font-bold rounded-full px-6 shadow-soft"
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
          <h3 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
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
                <div className="relative p-6 rounded-2xl border border-border bg-surface shadow-soft text-center h-full hover:-translate-y-1 transition-transform">
                  <div className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-accent font-bold text-sm mb-2">{item.year}</div>
                  <h4 className="text-foreground font-bold text-lg mb-2">{item.title}</h4>
                  <p className="text-muted text-sm">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}