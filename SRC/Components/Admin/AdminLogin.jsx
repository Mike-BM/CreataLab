import { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { Button } from './UI/button';
import { Input } from './UI/input';
import { adminAuth } from '@/Lib/admin-auth';
import { toast } from 'sonner';

// Memoized background effects to prevent re-renders on every keystroke
const BackgroundEffects = memo(() => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        x: [0, 50, 0],
        y: [0, -30, 0],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px]"
    />
    <motion.div
      animate={{
        scale: [1, 1.3, 1],
        x: [0, -40, 0],
        y: [0, 50, 0],
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[120px]"
    />
  </div>
));

BackgroundEffects.displayName = 'BackgroundEffects';

// Isolated Login Form component to localise state changes
const LoginForm = () => {
  const [email, setEmail] = useState(import.meta.env.DEV ? 'admin@creatalab.com' : '');
  const [password, setPassword] = useState(import.meta.env.DEV ? 'ChangeMe123!' : '');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();
      const result = await adminAuth.login(trimmedEmail, trimmedPassword);
      console.log('Login attempt result:', result);

      if (result.ok) {
        toast.success('Welcome back, Admin!');
        navigate('/admin/dashboard');
      } else {
        const messages = {
          network_error: 'Connection failed. Is the server running?',
          server_error: 'Server error. Please try again later.',
          invalid_credentials: 'Invalid email or password.',
          no_token: 'Server did not return a session token.',
          unknown: 'An unexpected error occurred.'
        };
        toast.error(messages[result.reason] || messages.unknown);
        if (result.reason === 'invalid_credentials') setPassword('');
      }
    } catch (err) {
      toast.error('Authentication failed unexpectedly.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="text-sm text-gray-300 mb-2 block">
          Email Address
        </label>
        <div className="relative">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@creatalab.com"
            className="px-4 h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/30"
            required
            autoFocus
          />
        </div>
      </div>
      <div>
        <label className="text-sm text-gray-300 mb-2 block">
          Admin Password
        </label>
        <div className="relative">
          <Lock className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="pl-10 pr-10 h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/30"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] transition-all duration-300"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Authenticating...
            </div>
          ) : (
            'Access Dashboard'
          )}
        </Button>
      </motion.div>
    </form>
  );
};

export default function AdminLogin() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center relative overflow-hidden">
      <BackgroundEffects />

      <div className="relative z-10 w-full max-w-md px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-[#111118] to-[#0a0a0f] rounded-3xl border-2 border-white/10 p-8 md:p-10 shadow-2xl backdrop-blur-xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/30 flex items-center justify-center"
            >
              <Shield className="w-8 h-8 text-purple-400" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Admin Portal
            </h1>
            <p className="text-gray-400 text-sm">
              Enter your credentials to access the admin dashboard
            </p>
          </div>

          <LoginForm />

          {/* Security notice */}
          <div className="mt-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
            <p className="text-xs text-yellow-300 text-center">
              🔒 This is a secure admin area. Unauthorized access is prohibited.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
