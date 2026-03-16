import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Shield, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { adminAuth } from '@/lib/admin-auth';
import { toast } from 'sonner';

const BackgroundElements = memo(() => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.05)_0%,transparent_70%)]" />
  </div>
));

BackgroundElements.displayName = 'BackgroundElements';

export default function AdminLogin() {
  // defaulting to the credentials the user liked for convenience
  const [email, setEmail] = useState('admin@creatalab.com');
  const [password, setPassword] = useState('CreataLabAdmin!2026');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    const toastId = toast.loading('Establishing secure connection...');

    try {
      const result = await adminAuth.login(email.trim().toLowerCase(), password);
      
      if (result) {
        toast.success('Access Granted. Welcome back, Admin.', { id: toastId });
        navigate('/admin/dashboard');
      } else {
        toast.error('Invalid credentials. Access denied.', { id: toastId });
      }
    } catch (err) {
      toast.error('Connection failed. Please check your environment.', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center relative px-6 py-12 selection:bg-purple-500/30">
      <BackgroundElements />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-card rounded-[2rem] p-8 md:p-10 border border-white/[0.08] shadow-2xl">
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 mb-6 group relative"
            >
              <div className="absolute inset-0 bg-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
              <Shield className="w-10 h-10 text-purple-400 relative z-10" />
            </motion.div>
            
            <motion.h1 
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-black text-white tracking-tight mb-3"
            >
              Control <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Center</span>
            </motion.h1>
            <motion.p 
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400/80 font-medium"
            >
              Secure administrative access
            </motion.p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-2"
            >
              <label className="text-sm font-semibold text-gray-400 ml-1">Identity</label>
              <div className="relative group">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@creatalab.com"
                  className="bg-white/[0.03] border-white/[0.08] focus:border-purple-500/50 focus:ring-purple-500/20 h-14 rounded-2xl text-white pl-4 transition-all"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-2"
            >
              <label className="text-sm font-semibold text-gray-400 ml-1">Access Key</label>
              <div className="relative group">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-white/[0.03] border-white/[0.08] focus:border-purple-500/50 focus:ring-purple-500/20 h-14 rounded-2xl text-white px-4 transition-all mb-1"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="pt-4"
            >
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 rounded-2xl premium-gradient text-white font-bold text-lg shadow-[0_10px_30px_-10px_rgba(168,85,247,0.5)] hover:shadow-[0_15px_40px_-10px_rgba(168,85,247,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale overflow-hidden"
              >
                <div className="flex items-center justify-center gap-3">
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <span>Enter Dashboard</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </div>
              </Button>
            </motion.div>
          </form>

          {/* Footer Decoration */}
          <div className="mt-10 pt-8 border-t border-white/[0.05] flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">System Protocols Active</span>
          </div>
        </div>
        
        <p className="text-center mt-8 text-gray-600 font-medium text-sm">
          &copy; {new Date().getFullYear()} creatalab Security Service
        </p>
      </motion.div>
    </div>
  );
}
