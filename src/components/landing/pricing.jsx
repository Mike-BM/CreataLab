import { motion } from 'framer-motion';
import { Check, Zap, Sparkles, Target, BarChart3, Database, Globe, Palette } from 'lucide-react';
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
    <section id="pricing" className="py-32 bg-[#050508] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-pink-600/5 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-purple-400 text-sm font-black uppercase tracking-[0.3em] mb-4 block">
            Investment & Value
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
            Transparent <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Pricing</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">
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
              className="glass-card rounded-[2.5rem] p-10 border border-white/[0.05] relative group hover:border-purple-500/30 transition-all duration-500"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-white/10 text-purple-400">
                  {idx === 0 ? <Globe className="w-6 h-6" /> : <Palette className="w-6 h-6" />}
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight uppercase">{category.title === 'Web Development' ? 'Website Design' : category.title}</h3>
              </div>

              <div className="space-y-6">
                {category.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all">
                    <div>
                      <h4 className="text-white font-bold mb-1">{item.name}</h4>
                      <p className="text-xs text-gray-500 font-medium">{item.details}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-purple-400 leading-none mb-1">{item.price}</p>
                      <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Starting Price</p>
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
                  className="w-full h-14 rounded-2xl border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5 text-gray-400 hover:text-white font-bold transition-all uppercase tracking-widest text-xs"
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
