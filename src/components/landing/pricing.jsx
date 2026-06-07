import { motion } from 'framer-motion';
import { Globe, Palette } from 'lucide-react';
import { useState, useEffect } from 'react';
import { appConfig } from '@/lib/config';

export default function Pricing() {
  const [pricing, setPricing] = useState(null);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await fetch(`${appConfig.api.base}/settings`);
        if (response.ok) {
          const data = await response.json();
          if (data.pricing) setPricing(data.pricing);
        }
      } catch (err) {
        console.error('Failed to load pricing matrix:', err);
      }
    };
    fetchPricing();
  }, []);

  if (!pricing) return null;

  return (
    <section id="pricing" className="py-32 bg-surface relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent-hover/5 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-accent text-sm font-bold uppercase tracking-widest mb-4 block">
            Investment & Value
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
            Transparent <span className="text-accent">Pricing</span>
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto font-medium">
            Strategic solutions tailored to your project scope. Choose a category to see our standard starting points.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {pricing.categories.map((category, idx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl p-10 border border-border bg-background relative group hover:border-accent hover:shadow-soft transition-all duration-500"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                  {idx === 0 ? <Globe className="w-6 h-6" /> : <Palette className="w-6 h-6" />}
                </div>
                <h3 className="text-2xl font-bold text-foreground tracking-tight uppercase">{category.title === 'Web Development' ? 'Website Design' : category.title}</h3>
              </div>

              <div className="space-y-6">
                {category.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-surface border border-border hover:bg-muted/10 transition-all">
                    <div>
                      <h4 className="text-foreground font-bold mb-1">{item.name}</h4>
                      <p className="text-xs text-muted font-medium">{item.details}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-accent leading-none mb-1">{item.price}</p>
                      <p className="text-[10px] text-muted font-bold uppercase tracking-widest">Starting Price</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <button 
                  onClick={() => {
                    const section = document.querySelector('#contact');
                    if (section) section.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full h-14 rounded-full border border-border hover:border-accent hover:bg-accent/5 text-foreground font-bold transition-all uppercase tracking-widest text-xs"
                >
                  Request Custom Quote
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
