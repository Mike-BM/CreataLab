import { motion } from 'framer-motion';
import { Cpu, Construction, Zap, ShieldAlert, Clock, Sparkles } from 'lucide-react';

export default function Maintenance({ message }) {
  return (
    <div className="fixed inset-0 bg-[#050508] flex items-center justify-center p-6 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card max-w-2xl w-full rounded-[3rem] p-12 md:p-16 border border-white/[0.05] relative z-10 text-center"
      >
        <div className="flex justify-center mb-10">
          <div className="relative">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-orange-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center relative"
            >
              <Cpu className="w-10 h-10 text-orange-400" />
            </motion.div>
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-orange-500 blur-sm"
            />
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-6 uppercase">
          SYSTEM <span className="text-orange-500">OPTIMIZATION</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 font-medium leading-relaxed mb-10">
          {message || "Our team of digital architects is currently fine-tuning the core engine for peak performance."}
        </p>

        <div className="grid grid-cols-3 gap-4 border-t border-white/[0.05] pt-10">
          <div className="text-center">
            <Zap className="w-5 h-5 text-gray-600 mx-auto mb-2" />
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Efficiency</p>
          </div>
          <div className="text-center">
            <ShieldAlert className="w-5 h-5 text-gray-600 mx-auto mb-2" />
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Security</p>
          </div>
          <div className="text-center">
            <Clock className="w-5 h-5 text-gray-600 mx-auto mb-2" />
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Stability</p>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-orange-500/50" />
          <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">creatalab SIGNAL v4.0.2</span>
        </div>
      </motion.div>
    </div>
  );
}
