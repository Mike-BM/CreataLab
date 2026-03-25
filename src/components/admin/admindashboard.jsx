import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Eye, 
  TrendingUp, 
  Users, 
  Clock, 
  ArrowUpRight, 
  Sparkles, 
  Activity,
  MessageSquare,
  Briefcase
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { appConfig } from '@/lib/config';
import { adminAuth } from '@/lib/admin-auth';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    posts: { count: 0, growth: '+0' },
    views: { count: '0', growth: '+0%' },
    projects: { count: 0, growth: '+0' },
    messages: { count: 0, growth: 'New' }
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = adminAuth.getToken();
        const response = await fetch(`${appConfig.api.base}/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setStats({
            posts: { count: data.posts || 0, growth: 'Total' },
            views: { count: '2.4K', growth: '+12% this week' }, // Views are still simulated or from external analytics
            projects: { count: data.projects || 0, growth: 'Live' },
            messages: { count: (data.inquiries || 0) + (data.bookings || 0), growth: 'Total Inquiries' }
          });
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Content', value: stats.posts.count, icon: FileText, color: 'from-purple-500 to-pink-500', change: stats.posts.growth, path: '/admin/posts' },
    { label: 'System Reach', value: stats.views.count, icon: Eye, color: 'from-blue-500 to-cyan-500', change: stats.views.growth, path: '/admin/analytics' },
    { label: 'Live Projects', value: stats.projects.count, icon: Briefcase, color: 'from-green-500 to-emerald-500', change: stats.projects.growth, path: '/admin/portfolio' },
    { label: 'Inquiries', value: stats.messages.count, icon: MessageSquare, color: 'from-orange-500 to-red-500', change: stats.messages.growth, path: '/admin/inquiries' },
  ];

  return (
    <div className="space-y-12">
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity rounded-[2.5rem]" />
        <div className="glass-card rounded-[2.5rem] p-10 md:p-12 border border-white/[0.05] relative overflow-hidden">
          <div className="absolute top-[-50%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-xs font-black text-purple-400 uppercase tracking-[0.3em]">Operational Status: Optimal</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Project Master</span>
              </h1>
              <p className="text-gray-400 text-lg max-w-xl font-medium leading-relaxed">
                The creatalab ecosystem is performing at peak efficiency. Here is your overview of the current cycle.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => navigate('/admin/portfolio/new')}
                className="bg-white text-black hover:bg-gray-200 font-bold rounded-2xl px-8 h-14 transition-all"
              >
                Launch Project
              </Button>
              <Button
                onClick={() => navigate('/admin/posts/new')}
                variant="outline"
                className="border-white/10 hover:bg-white/5 text-white font-bold rounded-2xl px-8 h-14 transition-all"
              >
                New Insight
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              onClick={() => navigate(stat.path)}
              className="glass-card rounded-3xl p-8 border border-white/[0.05] hover:border-purple-500/30 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="w-5 h-5 text-purple-400" />
              </div>
              
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              
              <div className="flex items-baseline gap-2 mb-1">
                <h3 className="text-3xl font-black text-white">{loading ? '...' : stat.value}</h3>
              </div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">{stat.label}</p>
              
              <div className="flex items-center gap-2">
                <div className="px-2 py-0.5 rounded-full bg-white/[0.05] text-[10px] font-black text-purple-400 uppercase">
                  {stat.change}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Insights & Monitoring */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Activity Monitor */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 glass-card rounded-[2rem] p-8 border border-white/[0.05]"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-white flex items-center gap-3 tracking-tight uppercase">
              <Activity className="w-5 h-5 text-purple-500" />
              Traffic Monitor
            </h2>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
              <div className="w-2 h-2 rounded-full bg-white/10" />
              <div className="w-2 h-2 rounded-full bg-white/10" />
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-3 px-4">
            {[40, 70, 45, 90, 65, 80, 50, 95, 60, 85, 40, 75].map((height, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: 0.6 + i * 0.05, duration: 1 }}
                className="flex-1 bg-gradient-to-t from-purple-600/20 to-purple-400 rounded-t-lg relative group cursor-help"
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black text-[10px] font-bold px-2 py-1 rounded-md">
                  {height}%
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between mt-6 px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>23:59</span>
          </div>
        </motion.div>

        {/* System Logs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="glass-card rounded-[2rem] p-8 border border-white/[0.05]"
        >
          <h2 className="text-xl font-black text-white mb-8 flex items-center gap-3 tracking-tight uppercase">
            <Clock className="w-5 h-5 text-pink-500" />
            Event Logs
          </h2>
          <div className="space-y-6">
            {[
              { label: 'Security Handshake', status: 'Success', time: '12m ago', color: 'text-green-400' },
              { label: 'Database Sync', status: 'Optimal', time: '1h ago', color: 'text-blue-400' },
              { label: 'Asset Deployment', status: 'Verified', time: '3h ago', color: 'text-purple-400' },
              { label: 'Credential Update', status: 'Root', time: '1d ago', color: 'text-orange-400' },
            ].map((log, i) => (
              <div key={i} className="flex items-start gap-4 group">
                <div className="w-1.5 h-10 rounded-full bg-white/[0.05] relative overflow-hidden shrink-0">
                  <div className={`absolute top-0 inset-x-0 h-1/2 bg-current ${log.color} opacity-50`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors uppercase tracking-tight">{log.label}</p>
                    <span className="text-[10px] font-black text-gray-500">{log.time}</span>
                  </div>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${log.color}`}>{log.status}</p>
                </div>
              </div>
            ))}
          </div>
          <Button
            variant="ghost"
            className="w-full mt-8 rounded-xl border border-white/5 text-gray-400 hover:text-white hover:bg-white/5 font-bold text-xs uppercase tracking-widest"
          >
            Clear Event Stream
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
