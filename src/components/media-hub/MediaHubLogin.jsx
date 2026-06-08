import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { toast } from 'sonner';
import { appConfig } from '@/lib/config';

export default function MediaHubLogin() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [orgLogo, setOrgLogo] = useState('');
  const [orgColor, setOrgColor] = useState('#A855F7');
  const navigate = useNavigate();

  useEffect(() => {
    // Inject noindex meta tag to hide from search engines
    const meta = document.createElement('meta');
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);

    // Fetch organization logo
    fetch(`${appConfig.api.base}/settings`)
      .then(res => res.json())
      .then(data => {
        if (data.media_hub_org_logo) {
          setOrgLogo(data.media_hub_org_logo);
        }
        if (data.media_hub_org_color) {
          setOrgColor(data.media_hub_org_color);
        }
      })
      .catch(console.error);

    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!code) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${appConfig.api.base}/media/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });

      if (response.ok) {
        localStorage.setItem('creatalab_media_hub_code', code);
        toast.success('Access Granted');
        navigate('/media-hub');
      } else {
        toast.error('Access Denied: Incorrect code');
      }
    } catch (err) {
      toast.error('Connection error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-card rounded-[2.5rem] p-8 md:p-12 border border-white/[0.05] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] -z-10" style={{ backgroundColor: orgColor, opacity: 0.15 }} />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-[80px] -z-10" style={{ backgroundColor: orgColor, opacity: 0.1 }} />
          
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: orgColor, boxShadow: `0 0 40px ${orgColor}4D` }}>
              {orgLogo ? (
                <img src={orgLogo} alt="Organization Logo" className="w-10 h-10 object-contain drop-shadow-md" />
              ) : (
                <Lock className="w-8 h-8 text-white" />
              )}
            </div>
          </div>
          
          <div className="text-center space-y-3 mb-10">
            <div>
              <h1 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Executive Media Hub</h1>
              <p className="text-gray-400 text-sm font-medium">Enter the organization access code to view secure resources.</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Access Code</label>
              <Input
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter shared code..."
                className="bg-white/[0.03] border-white/[0.08] focus:border-purple-500/50 h-14 rounded-2xl text-center text-white font-bold tracking-[0.2em]"
                required
              />
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full text-white font-bold rounded-2xl h-14 shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              style={{ backgroundColor: orgColor, boxShadow: `0 4px 14px 0 ${orgColor}66` }}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Access Resources <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
