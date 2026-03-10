import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Eye, Users, Clock, BarChart3, ArrowUpRight, Sparkles, Activity, Zap, Target } from 'lucide-react';

const analyticsData = {
  overview: [
    { label: 'Total Views', value: '2,456', change: '+12.5%', trend: 'up', icon: Eye, color: 'from-blue-500 to-cyan-500', progress: 75 },
    { label: 'Unique Visitors', value: '1,234', change: '+8.2%', trend: 'up', icon: Users, color: 'from-purple-500 to-pink-500', progress: 68 },
    { label: 'Avg. Session', value: '3:24', change: '+5.1%', trend: 'up', icon: Clock, color: 'from-green-500 to-emerald-500', progress: 82 },
    { label: 'Bounce Rate', value: '32%', change: '-2.3%', trend: 'down', icon: Target, color: 'from-orange-500 to-red-500', progress: 32 },
  ],
  topPosts: [
    { title: 'Welcome to CreataLab', views: 456, engagement: 89, trend: 'up', category: 'Company' },
    { title: 'Design Trends for 2024', views: 389, engagement: 76, trend: 'up', category: 'Design' },
    { title: 'Data Visualization Guide', views: 234, engagement: 65, trend: 'up', category: 'Data & Analytics' },
  ],
  recentActivity: [
    { time: '2h ago', event: 'New visitor from Kenya', type: 'visit' },
    { time: '5h ago', event: 'Post shared on LinkedIn', type: 'share' },
    { time: '1d ago', event: '100+ views milestone reached', type: 'milestone' },
  ],
};

export default function AdminAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  return (
    <div className="space-y-6">
      {/* Header with animated icon */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
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
              <Activity className="w-5 h-5 text-purple-400" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white">Analytics & Insights</h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400"
          >
            Track your site performance and engagement metrics
          </motion.p>
        </div>
        <div className="flex gap-2">
          {['day', 'week', 'month'].map((period) => (
            <motion.button
              key={period}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${
                selectedPeriod === period
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
              }`}
            >
              {period}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Overview Stats with Progress Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsData.overview.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.1, type: 'spring' }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group relative bg-gradient-to-br from-[#111118] to-[#0a0a0f] rounded-2xl border border-white/10 p-6 overflow-hidden cursor-pointer hover:border-purple-500/30 transition-all"
            >
              {/* Animated background */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
                    className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                      stat.trend === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    <TrendingUp className={`w-3 h-3 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                    {stat.change}
                  </motion.div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
                <p className="text-sm text-gray-400 mb-3">{stat.label}</p>
                
                {/* Progress Bar */}
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.progress}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 1, ease: "easeOut" }}
                    className={`h-full bg-gradient-to-r ${stat.color} rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]`}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Top Posts with Enhanced Cards */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-[#111118] to-[#0a0a0f] rounded-2xl border border-white/10 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Top Performing Posts</h2>
          </div>
          <div className="space-y-4">
            {analyticsData.topPosts.map((post, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1, type: 'spring' }}
                whileHover={{ x: 5, scale: 1.02 }}
                className="group relative p-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/30 transition-all cursor-pointer overflow-hidden"
              >
                {/* Rank Badge */}
                <div className="absolute top-4 right-4">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                        : index === 1
                        ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                        : 'bg-gradient-to-r from-orange-600 to-orange-700 text-white'
                    }`}
                  >
                    #{index + 1}
                  </motion.div>
                </div>

                <div className="pr-12">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-medium">
                      {post.category}
                    </span>
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="w-1 h-1 rounded-full bg-green-400"
                    />
                  </div>
                  <h3 className="text-white font-semibold mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all">
                    {post.title}
                  </h3>
                  
                  {/* Stats */}
                  <div className="flex items-center gap-6 mb-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Eye className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300 font-medium">{post.views.toLocaleString()}</span>
                      <span className="text-gray-500">views</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300 font-medium">{post.engagement}%</span>
                      <span className="text-gray-500">engagement</span>
                    </div>
                  </div>

                  {/* Engagement Progress */}
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${post.engagement}%` }}
                      transition={{ delay: 0.7 + index * 0.1, duration: 1 }}
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-[#111118] to-[#0a0a0f] rounded-2xl border border-white/10 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Recent Activity</h2>
          </div>
          <div className="space-y-4">
            {analyticsData.recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'visit'
                      ? 'bg-blue-500/20'
                      : activity.type === 'share'
                      ? 'bg-purple-500/20'
                      : 'bg-green-500/20'
                  }`}
                >
                  {activity.type === 'visit' && <Users className="w-5 h-5 text-blue-400" />}
                  {activity.type === 'share' && <TrendingUp className="w-5 h-5 text-purple-400" />}
                  {activity.type === 'milestone' && <Target className="w-5 h-5 text-green-400" />}
                </motion.div>
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">{activity.event}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-purple-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
