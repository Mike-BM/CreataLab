import { BrainCircuit, Sparkles, Bot, Zap, Code, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const aiPartners = [
  { id: 1, name: "NeuralNet", icon: BrainCircuit, style: "h-16 w-16 text-accent bg-accent/10 p-4 rounded-2xl" },
  { id: 2, name: "DataCore", icon: Sparkles, style: "h-16 w-16 text-accent bg-accent/10 p-4 rounded-2xl" },
  { id: 3, name: "AutoBot", icon: Bot, style: "h-16 w-16 text-accent bg-accent/10 p-4 rounded-2xl" },
  { id: 4, name: "ZapAI", icon: Zap, style: "h-16 w-16 text-accent bg-accent/10 p-4 rounded-2xl" },
  { id: 5, name: "CodeX", icon: Code, style: "h-16 w-16 text-accent bg-accent/10 p-4 rounded-2xl" },
  { id: 6, name: "SecureMind", icon: Shield, style: "h-16 w-16 text-accent bg-accent/10 p-4 rounded-2xl" },
];

export default function AIPartners() {
  return (
    <section id="ai-partners" className="py-24 bg-surface relative overflow-hidden">
      
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold uppercase tracking-widest text-foreground">
          Ecosystem Partners
        </h2>
      </div>

      <div className="relative z-10 w-full overflow-hidden flex items-center h-48 py-8">
        
        {/* Marquee Container */}
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "linear",
          }}
          className="flex items-center gap-16 md:gap-32 whitespace-nowrap"
        >
          {/* Double the array for seamless looping */}
          {[...aiPartners, ...aiPartners, ...aiPartners].map((partner, index) => (
            <div
              key={`${partner.id}-${index}`}
              className="group flex flex-col items-center justify-center flex-shrink-0 opacity-80 hover:opacity-100 transition-opacity"
            >
              <div className={`flex items-center justify-center ${partner.style} transition-transform duration-300 hover:scale-110`}>
                <partner.icon className="w-full h-full" />
              </div>
              <span className="mt-4 text-sm font-semibold tracking-widest text-muted group-hover:text-accent transition-colors">
                {partner.name}
              </span>
            </div>
          ))}
        </motion.div>
        
      </div>
      
    </section>
  );
}
