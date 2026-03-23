import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Calendar, 
  User, 
  X, 
  Filter, 
  TrendingUp, 
  Clock, 
  Sparkles, 
  FileText,
  BarChart3,
  MessageSquare,
  ChevronRight,
  MoreVertical,
  ArrowUpRight,
  Globe
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { adminAuth } from '@/lib/admin-auth';
import { appConfig } from '@/lib/config';

export default function AdminPosts() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${appConfig.api.base}/posts`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (err) {
      console.error('Failed to sync content stream:', err);
      toast.error('Content synchronization failed');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'published' && post.published) ||
      (filterStatus === 'draft' && !post.published);

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: posts.length,
    published: posts.filter(p => p.published).length,
    draft: posts.filter(p => !p.published).length,
    totalViews: posts.reduce((sum, p) => sum + (p.views || 0), 0),
  };

  const handleDelete = async (id) => {
    if (window.confirm('Permanent deletion of this insight?')) {
      try {
        const token = adminAuth.getToken();
        const response = await fetch(`${appConfig.api.base}/posts/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          setPosts(posts.filter((post) => post.id !== id));
          toast.success('Insight removed from core');
        } else {
          toast.error('Deletion protocol failed');
        }
      } catch (err) {
        toast.error('Connection error');
      }
    }
  };

  const handleTogglePublish = async (post) => {
    try {
      const token = adminAuth.getToken();
      const response = await fetch(`${appConfig.api.base}/posts/${post.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...post, published: !post.published })
      });
      if (response.ok) {
        setPosts(posts.map((p) => p.id === post.id ? { ...p, published: !p.published } : p));
        toast.success(`Post ${!post.published ? 'Deployment Active' : 'Returned to Staging'}`);
      }
    } catch (err) {
      toast.error('Update failed');
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl premium-gradient flex items-center justify-center text-white shadow-lg">
              <FileText className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">Insights & <span className="text-gray-600">Websites</span></h1>
          </div>
          <p className="text-gray-400 font-medium">Publishing community updates and direct website links</p>
        </div>
        <Button
          onClick={() => navigate('/admin/posts/new')}
          className="premium-gradient text-white font-bold rounded-2xl px-8 h-14 shadow-lg hover:scale-105 transition-all"
        >
          <Plus className="w-5 h-5 mr-3" />
          Draft New Insight
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Index', value: stats.total, color: 'from-purple-500/20 to-purple-500/10', icon: FileText, text: 'text-purple-400' },
          { label: 'Live Stream', value: stats.published, color: 'from-green-500/20 to-green-500/10', icon: TrendingUp, text: 'text-green-400' },
          { label: 'Staging', value: stats.draft, color: 'from-orange-500/20 to-orange-500/10', icon: Clock, text: 'text-orange-400' },
          { label: 'Total Reach', value: stats.totalViews.toLocaleString(), color: 'from-blue-500/20 to-blue-500/10', icon: Eye, text: 'text-blue-400' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`glass-card rounded-[2rem] p-6 border border-white/[0.05] relative overflow-hidden`}
          >
            <div className={`absolute -right-4 -top-4 opacity-10 ${stat.text}`}>
              <stat.icon className="w-20 h-20" />
            </div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">{stat.label}</p>
            <h3 className={`text-2xl font-black ${stat.text}`}>{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        <div className="w-full lg:flex-1 relative group">
          <Search className="w-4 h-4 text-gray-500 absolute left-5 top-1/2 -translate-y-1/2 group-focus-within:text-purple-400 transition-colors" />
          <input
            placeholder="Query content records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 pl-14 pr-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] focus:border-purple-500/50 text-white outline-none transition-all font-medium"
          />
        </div>
        <div className="flex gap-2">
            {['all', 'published', 'draft'].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filterStatus === s ? 'bg-white text-black' : 'text-gray-500 hover:text-white bg-white/[0.03]'
                }`}
              >
                {s}
              </button>
            ))}
        </div>
      </div>

      {/* List Display */}
      {isLoading ? (
        <div className="h-64 glass-card rounded-[2.5rem] flex flex-col items-center justify-center gap-4">
          <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post, i) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-3xl p-6 border border-white/[0.05] group hover:border-purple-500/30 transition-all flex flex-col md:flex-row md:items-center gap-6"
              >
                <div className="w-20 h-20 rounded-2xl bg-white/[0.03] flex items-center justify-center shrink-0 group-hover:bg-purple-500/10 transition-colors">
                   <FileText className="w-8 h-8 text-gray-700 group-hover:text-purple-500 transition-colors" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest bg-purple-500/10 px-2 py-0.5 rounded">
                      {post.category || 'Legacy'}
                    </span>
                    <span className="text-[10px] font-black text-gray-500 uppercase flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {post.readTime || '3m'} read
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white group-hover:text-purple-400 transition-colors truncate mb-1">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium line-clamp-1">{post.excerpt}</p>
                </div>

                <div className="flex items-center gap-8 md:px-6">
                   <div className="text-center hidden xl:block">
                      <p className="text-lg font-black text-white leading-none mb-1">{post.views || 0}</p>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Views</p>
                   </div>
                   <div className="h-10 w-px bg-white/[0.05] hidden xl:block" />
                   <button 
                    onClick={() => handleTogglePublish(post)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      post.published ? 'text-green-400 bg-green-500/10' : 'text-gray-500 bg-white/[0.03]'
                    }`}
                   >
                     {post.published ? 'Deployment Active' : 'Staging'}
                   </button>
                </div>

                <div className="flex items-center gap-2">
                   <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => navigate(`/admin/posts/edit/${post.id}`)}
                    className="w-12 h-12 rounded-2xl bg-white/[0.03] text-gray-400 hover:text-white hover:bg-purple-500/20"
                   >
                     <Edit className="w-5 h-5" />
                   </Button>
                   <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(post.id)}
                    className="w-12 h-12 rounded-2xl bg-white/[0.03] text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                   >
                     <Trash2 className="w-5 h-5" />
                   </Button>
                   <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => {
                        const destination = post.link || `/blog/${post.slug}`;
                        window.open(destination, '_blank');
                    }}
                    className="w-12 h-12 rounded-2xl bg-white/[0.03] text-gray-400 hover:text-purple-400 hover:bg-white/10"
                   >
                     {post.link ? <Globe className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                   </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {!isLoading && filteredPosts.length === 0 && (
            <div className="h-64 glass-card rounded-[2.5rem] flex flex-col items-center justify-center text-center p-12">
               <MessageSquare className="w-12 h-12 text-gray-700 mb-4" />
               <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">No matching insights found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
