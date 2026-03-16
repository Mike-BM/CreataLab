import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Eye, 
  Users, 
  Clock, 
  BarChart3, 
  ArrowUpRight, 
  Sparkles, 
  Activity, 
  Zap, 
  Target,
  ChevronDown,
  Filter,
  Download,
  Loader2
} from 'lucide-react';
import { Button } from './ui/button';
import { appConfig } from '@/lib/config';

export default function AdminAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPeriod]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // In a real scenario, we'd hit /api/admin/stats
      // For now, simulating a high-end data response
      await new Promise(r => setTimeout(r, 1200));
      
      setStats({
        overview: [
          { label: 'Total Views', value: '12,456', change: '+12.5%', trend: 'up', icon: Eye, color: 'from-blue-500 to-cyan-500', progress: 75 },
          { label: 'Session Time', value: '4:12', change: '+8.2%', trend: 'up', icon: Clock, color: 'from-purple-500 to-pink-500', progress: 68 },
          { label: 'Conversion', value: '3.2%', change: '+5.1%', trend: 'up', icon: Target, color: 'from-green-500 to-emerald-500', progress: 82 },
          { label: 'Bounce Rate', value: '24%', change: '-2.3%', trend: 'down', icon: Activity, color: 'from-orange-500 to-red-500', progress: 24 },
        ],
        topContent: [
          { title: 'The Future of Creative Tech', views: 1456, growth: 89, category: 'Strategy' },
          { title: 'Rebranding Case Study: X-Flow', views: 982, growth: 76, category: 'Case Study' },
          { title: 'Data Visualization Mastery', views: 874, growth: 65, category: 'Tutorial' },
        ],
        geographic: [
          { country: 'United States', visitors: '4.2K', share: 45 },
          { country: 'United Kingdom', visitors: '2.1K', share: 22 },
          { country: 'Kenya', visitors: '1.8K', share: 18 },
          { country: 'Others', visitors: '1.5K', share: 15 },
        ]
      });
    } catch (err) {
      console.error('Failed to sync analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl premium-gradient flex items-center justify-center text-white shadow-lg">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">ANALYTICS <span className="text-gray-600">ENGINE</span></h1>
          </div>
          <p className="text-gray-400 font-medium">Processing real-time engagement data stream</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="glass-card rounded-2xl p-1 flex items-center gap-1">
            {['24h', 'week', 'month'].map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPeriod(p)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  selectedPeriod === p ? 'bg-white text-black' : 'text-gray-500 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <Button variant="outline" className="rounded-2xl border-white/5 h-12 px-5 text-gray-400 hover:text-white">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {loading && !stats ? (
        <div className="h-96 glass-card rounded-[2.5rem] flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest animate-pulse">Syncing with Insight Engine...</p>
        </div>
      ) : (
        <>
          {/* Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.overview.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-[2rem] p-8 border border-white/[0.05] relative group"
              >
                <div className={`absolute top-0 right-0 p-6 ${stat.trend === 'up' ? 'text-green-400' : 'text-orange-400'}`}>
                   <div className="flex items-center gap-1 font-black text-xs">
                     <TrendingUp className={`w-3 h-3 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                     {stat.change}
                   </div>
                </div>

                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-6 shadow-lg`}>
                   <stat.icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-3xl font-black text-white mb-1 tracking-tighter">{stat.value}</h3>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{stat.label}</p>
                
                <div className="mt-6 h-1.5 rounded-full bg-white/[0.03] overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.progress}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full bg-gradient-to-r ${stat.color} rounded-full`} 
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Top Performing Content */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-lg font-black text-white px-2 flex items-center gap-3 uppercase tracking-widest">
                <Zap className="w-5 h-5 text-purple-500" />
                Performance Matrix
              </h2>
              <div className="glass-card rounded-[2.5rem] p-4 border border-white/[0.05] divide-y divide-white/[0.03]">
                {stats.topContent.map((content, i) => (
                  <div key={i} className="p-6 flex items-center justify-between group hover:bg-white/[0.02] transition-all cursor-pointer first:rounded-t-[2rem] last:rounded-b-[2rem]">
                    <div className="flex items-center gap-6">
                      <div className="text-xl font-black text-gray-700 group-hover:text-purple-500 transition-colors">0{i+1}</div>
                      <div>
                        <p className="text-xs font-black text-purple-400 uppercase tracking-widest mb-1">{content.category}</p>
                        <h4 className="text-white font-bold tracking-tight">{content.title}</h4>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-xl font-black text-white mb-0.5">{content.views.toLocaleString()}</p>
                       <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Views</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Geographic Distribution */}
            <div className="space-y-6">
              <h2 className="text-lg font-black text-white px-2 flex items-center gap-3 uppercase tracking-widest">
                <Target className="w-5 h-5 text-pink-500" />
                Geographic Hub
              </h2>
              <div className="glass-card rounded-[2.5rem] p-8 border border-white/[0.05]">
                <div className="space-y-8">
                  {stats.geographic.map((geo, i) => (
                    <div key={i} className="space-y-3">
                      <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
                        <span className="text-white">{geo.country}</span>
                        <span className="text-gray-500">{geo.visitors}</span>
                      </div>
                      <div className="h-4 rounded-xl bg-white/[0.03] overflow-hidden p-1">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${geo.share}%` }}
                          transition={{ delay: i * 0.1, duration: 1 }}
                          className={`h-full rounded-lg bg-gradient-to-r ${
                            i === 0 ? 'from-purple-600 to-purple-400' :
                            i === 1 ? 'from-pink-600 to-pink-400' :
                            'from-gray-600 to-gray-400'
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button variant="ghost" className="w-full mt-10 rounded-2xl border border-white/5 text-gray-500 hover:text-white hover:bg-white/5 font-bold text-[10px] uppercase tracking-[0.2em]">
                   Open Global Map
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
