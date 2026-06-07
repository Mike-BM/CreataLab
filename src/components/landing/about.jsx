import { motion } from 'framer-motion';

export default function About() {
  return (
    <section id="about" className="py-32 bg-background relative overflow-visible">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Asymmetric Text Side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2"
          >
            <div className="inline-block px-4 py-1 rounded-full bg-accent/10 border border-accent/20 mb-8">
              <span className="text-accent-hover text-xs font-bold uppercase tracking-widest">
                Who We Are
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight tracking-tight">
            Data meets <span className="text-accent">Design</span>
          </h2>    
            
            <div className="space-y-6 text-muted text-lg md:text-xl font-normal leading-[1.7]">
              <p>
                <span className="text-foreground font-bold">Every pixel is intentional, every color choice is debated, every animation is stress-tested.</span>
              </p>
              <p>
                We're a design studio that actually gets our hands dirty. We don't believe in SaaS template vibes, perfectly symmetrical layouts, or overly polished corporate speak. 
              </p>
              <p>
                Our team stays up until 3am tweaking kerning because we care about the details that transform a good digital presence into an unforgettable one.
              </p>
            </div>

            <div className="mt-12 flex gap-4">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center">
                <span className="font-bold text-2xl text-accent">01</span>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-secondary/30 flex items-center justify-center">
                <span className="font-bold text-2xl text-secondary-foreground">02</span>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-muted/20 flex items-center justify-center">
                <span className="font-bold text-2xl text-muted-foreground">03</span>
              </div>
            </div>
          </motion.div>

          {/* Asymmetric Image Side (Breaking out of container) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="w-full lg:w-1/2 relative"
          >
            {/* The image breaks out by 20px on the right and bottom */}
            <div className="relative w-full h-auto">
              <div className="absolute inset-0 bg-accent/20 rounded-2xl transform translate-x-4 translate-y-4 -z-10" />
              <img 
                src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop" 
                alt="Our creative process" 
                className="relative z-10 w-full h-[500px] object-cover rounded-2xl shadow-soft"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}