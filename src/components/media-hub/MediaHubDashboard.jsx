import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, LogOut, Loader2 } from 'lucide-react';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { toast } from 'sonner';
import { appConfig } from '@/lib/config';
import ResourceCard from './ResourceCard';

const CATEGORIES = [
  'All',
  'Countdown Posters',
  'Event Flyers',
  'Social Media Graphics',
  'Official Documents',
  'Logos and Brand Assets',
  'Marketing Resources'
];

export default function MediaHubDashboard() {
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [orgLogo, setOrgLogo] = useState('');
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
      })
      .catch(console.error);

    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  useEffect(() => {
    const fetchResources = async () => {
      const code = localStorage.getItem('creatalab_media_hub_code');
      if (!code) {
        navigate('/media-hub/login');
        return;
      }

      try {
        const response = await fetch(`${appConfig.api.base}/media`, {
          headers: { 'x-media-code': code }
        });

        if (response.status === 401) {
          localStorage.removeItem('creatalab_media_hub_code');
          toast.error('Session expired or invalid code.');
          navigate('/media-hub/login');
          return;
        }

        if (response.ok) {
          const data = await response.json();
          setResources(data);
        } else {
          toast.error('Failed to load resources.');
        }
      } catch (err) {
        console.error(err);
        toast.error('Network error.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('creatalab_media_hub_code');
    navigate('/media-hub/login');
  };

  const handleDownload = async (resource) => {
    const code = localStorage.getItem('creatalab_media_hub_code');
    const toastId = toast.loading('Initiating download...');
    try {
      const response = await fetch(`${appConfig.api.base}/media/${resource.id}/download`, {
        method: 'POST',
        headers: { 'x-media-code': code }
      });

      if (!response.ok) throw new Error('Download failed');
      const { url } = await response.json();
      
      toast.success('Download starting...', { id: toastId });
      
      // Trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = resource.title;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
    } catch (err) {
      toast.error('Failed to download resource.', { id: toastId });
    }
  };

  const filteredResources = resources.filter(res => {
    const matchesCategory = activeCategory === 'All' || res.category === activeCategory;
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (res.description && res.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center">
         <Loader2 className="w-10 h-10 animate-spin" style={{ color: orgColor || '#A855F7' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#050508]/80 backdrop-blur-xl border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black overflow-hidden" style={{ backgroundColor: orgColor || '#A855F7' }}>
                {orgLogo ? (
                  <img src={orgLogo} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  "MH"
                )}
             </div>
             <div>
                <h1 className="font-black tracking-widest uppercase text-sm leading-none">Media Hub</h1>
                <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Secure Access</p>
             </div>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-gray-400 hover:text-white rounded-xl">
             <LogOut className="w-4 h-4 mr-2" /> Exit
          </Button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Area */}
        <div className="mb-12 space-y-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources, posters, guidelines..."
              className="w-full bg-white/[0.03] border-white/[0.08] focus:border-purple-500/50 h-14 pl-12 rounded-2xl text-white font-medium text-lg"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${
                  activeCategory === cat 
                    ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                    : 'bg-white/[0.03] text-gray-400 border border-white/[0.08] hover:bg-white/[0.1] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        {filteredResources.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredResources.map((resource, idx) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.05, 0.5) }}
              >
                <ResourceCard resource={resource} onDownload={handleDownload} orgColor={orgColor || '#A855F7'} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 glass-card rounded-[2.5rem] border border-white/[0.05]">
            <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-black uppercase tracking-widest mb-2">No Resources Found</h3>
            <p className="text-gray-500 text-sm">We couldn't find any resources matching your criteria.</p>
          </div>
        )}
      </main>
    </div>
  );
}
