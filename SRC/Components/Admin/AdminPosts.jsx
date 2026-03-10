import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Search, Calendar, User, X, Filter, TrendingUp, Clock, Sparkles, FileText } from 'lucide-react';
import { Button } from './UI/button';
import { Input } from './UI/input';
import { toast } from 'sonner';
import { adminAuth } from '@/lib/admin-auth';
import { appConfig } from '@/lib/config';

// Mock blog posts data - in production, fetch from API
const mockPosts = [
  {
    id: 1,
    slug: 'welcome-to-creatalab',
    title: 'Welcome to CreataLab',
    excerpt: 'Discover how we blend creativity with technology to create amazing digital experiences.',
    author: 'CreataLab Team',
    date: '2024-01-15',
    category: 'Company',
    published: true,
    views: 245,
    engagement: 89,
    readTime: '5 min',
  },
  {
    id: 2,
    slug: 'design-trends-2024',
    title: 'Design Trends for 2024',
    excerpt: 'Exploring the latest design trends that will shape digital experiences this year.',
    author: 'Design Team',
    date: '2024-01-10',
    category: 'Design',
    published: true,
    views: 189,
    engagement: 76,
    readTime: '3 min',
  },
  {
    id: 3,
    slug: 'data-visualization-guide',
    title: 'Mastering Data Visualization',
    excerpt: 'Learn how to transform complex data into compelling visual stories.',
    author: 'Data Team',
    date: '2024-01-05',
    category: 'Data & Analytics',
    published: false,
    views: 0,
    engagement: 0,
    readTime: '8 min',
  },
];

export default function AdminPosts() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState(mockPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, published, draft

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

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
    totalViews: posts.reduce((sum, p) => sum + p.views, 0),
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const token = adminAuth.getToken();
        const response = await fetch(`${appConfig.api.postsBase || 'http://localhost:4000/api'}/posts/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          setPosts(posts.filter((post) => post.id !== id));
          toast.success('Post deleted successfully');
        } else {
          toast.error('Failed to delete post');
        }
      } catch (err) {
        toast.error('Error deleting post');
      }
    }
  };

  const handleTogglePublish = async (id) => {
    const post = posts.find((p) => p.id === id);
    if (!post) return;
    try {
      const token = adminAuth.getToken();
      const response = await fetch(`${appConfig.api.postsBase || 'http://localhost:4000/api'}/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...post, published: !post.published })
      });
      if (response.ok) {
        setPosts(
          posts.map((p) =>
            p.id === id ? { ...p, published: !p.published } : p
          )
        );
        toast.success('Post status updated');
      } else {
        toast.error('Failed to update status');
      }
    } catch (err) {
      toast.error('Error updating status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with animated title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3 mb-2"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600/30 to-pink-600/30 flex items-center justify-center"
            >
              <Sparkles className="w-5 h-5 text-purple-400" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white">Blog & Insights</h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400"
          >
            Manage all your blog posts and content
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={() => navigate('/admin/posts/new')}
            className="group relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-full px-6 flex items-center gap-2 shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] transition-all overflow-hidden"
          >
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />
            <Plus className="w-4 h-4 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
            <span className="relative z-10">New Post</span>
          </Button>
        </motion.div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Posts', value: stats.total, color: 'from-purple-500 to-pink-500', icon: FileText },
          { label: 'Published', value: stats.published, color: 'from-green-500 to-emerald-500', icon: TrendingUp },
          { label: 'Drafts', value: stats.draft, color: 'from-orange-500 to-red-500', icon: Clock },
          { label: 'Total Views', value: stats.totalViews.toLocaleString(), color: 'from-blue-500 to-cyan-500', icon: Eye },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1, type: 'spring' }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-gradient-to-br from-[#111118] to-[#0a0a0f] rounded-xl border border-white/10 p-4 cursor-pointer group"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-xs text-gray-400">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col md:flex-row gap-4"
      >
        <div className="flex-1 relative group">
          <Search className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-purple-400 transition-colors" />
          <Input
            placeholder="Search posts by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 pr-10 h-12 rounded-full bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/30 hover:border-white/20 transition-all backdrop-blur-sm"
          />
          {searchQuery && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </div>
        <div className="flex gap-2">
          {['all', 'published', 'draft'].map((status) => (
            <motion.button
              key={status}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${filterStatus === status
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
            >
              <Filter className="w-4 h-4 inline mr-1.5" />
              {status}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Posts Grid */}
      <AnimatePresence mode="wait">
        {filteredPosts.length > 0 ? (
          <motion.div
            key="posts-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative bg-gradient-to-br from-[#111118] to-[#0a0a0f] rounded-2xl border-2 border-white/10 hover:border-purple-500/50 overflow-hidden cursor-pointer transition-all duration-300 shadow-lg hover:shadow-[0_0_40px_rgba(168,85,247,0.3)]"
              >
                {/* Animated gradient overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100"
                />

                <div className="relative z-10 p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="inline-block mb-3"
                      >
                        <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-400/30 text-purple-300 text-xs font-semibold backdrop-blur-sm shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                          {post.category}
                        </span>
                      </motion.div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-300 line-clamp-2 mb-4">{post.excerpt}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTogglePublish(post.id);
                      }}
                      className={`ml-4 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${post.published
                        ? 'bg-gradient-to-r from-green-500/30 to-emerald-500/30 text-green-400 border border-green-400/30'
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/20'
                        }`}
                    >
                      {post.published ? '✓ Published' : 'Draft'}
                    </motion.button>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <User className="w-4 h-4 text-purple-400" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="w-4 h-4 text-pink-400" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  {/* Engagement Bar */}
                  {post.published && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-gray-400">Engagement</span>
                        <span className="text-purple-400 font-semibold">{post.engagement}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${post.engagement}%` }}
                          transition={{ delay: 0.5 + index * 0.1, duration: 1, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                        />
                      </div>
                    </div>
                  )}

                  {/* Footer with actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-gray-300 font-medium">{post.views.toLocaleString()} views</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/blog/${post.slug}`);
                        }}
                        className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/posts/edit/${post.id}`);
                        }}
                        className="p-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(post.id);
                        }}
                        className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-gradient-to-br from-[#111118] to-[#0a0a0f] rounded-2xl border border-white/10 p-12 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center"
            >
              <Search className="w-8 h-8 text-purple-400" />
            </motion.div>
            <h3 className="text-xl font-semibold text-white mb-2">No posts found</h3>
            <p className="text-gray-400 mb-6">
              {searchQuery ? 'Try adjusting your search or filters' : 'Create your first post to get started'}
            </p>
            {searchQuery && (
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setFilterStatus('all');
                }}
                variant="outline"
                className="rounded-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
              >
                Clear filters
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
