import { motion } from 'framer-motion';
import { FileText, Eye, TrendingUp, Users, Clock, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './UI/button';

const stats = [
  { label: 'Total Posts', value: '12', icon: FileText, color: 'from-purple-500 to-pink-500', change: '+3 this month' },
  { label: 'Total Views', value: '2.4K', icon: Eye, color: 'from-blue-500 to-cyan-500', change: '+12% this week' },
  { label: 'Engagement', value: '89%', icon: TrendingUp, color: 'from-green-500 to-emerald-500', change: '+5% this week' },
  { label: 'Active Users', value: '156', icon: Users, color: 'from-orange-500 to-red-500', change: '+8 this week' },
];

const recentActivity = [
  { type: 'post', action: 'Published', title: 'Design Trends for 2024', time: '2 hours ago' },
  { type: 'post', action: 'Updated', title: 'Welcome to CreataLab', time: '5 hours ago' },
  { type: 'user', action: 'New signup', title: 'john@example.com', time: '1 day ago' },
  { type: 'analytics', action: 'Milestone', title: '1000+ page views', time: '2 days ago' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back! Here's what's happening.</p>
        </div>
        <Button
          onClick={() => navigate('/admin/posts/new')}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-full px-6"
        >
          New Post
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-[#111118] to-[#0a0a0f] rounded-2xl border border-white/10 p-6 hover:border-purple-500/30 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-gray-500 group-hover:text-purple-400 transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-400 mb-2">{stat.label}</p>
              <p className="text-xs text-green-400">{stat.change}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-[#111118] to-[#0a0a0f] rounded-2xl border border-white/10 p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" />
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {activity.type === 'post' && <FileText className="w-5 h-5 text-purple-400" />}
                  {activity.type === 'user' && <Users className="w-5 h-5 text-blue-400" />}
                  {activity.type === 'analytics' && <TrendingUp className="w-5 h-5 text-green-400" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">{activity.action}</p>
                  <p className="text-xs text-gray-400">{activity.title}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-[#111118] to-[#0a0a0f] rounded-2xl border border-white/10 p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Button
              onClick={() => navigate('/admin/posts/new')}
              className="w-full justify-start bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 border border-purple-500/30 text-white rounded-xl"
            >
              <FileText className="w-4 h-4 mr-2" />
              Create New Post
            </Button>
            <Button
              onClick={() => navigate('/admin/posts')}
              variant="outline"
              className="w-full justify-start border-white/10 hover:bg-white/5 text-gray-300 hover:text-white rounded-xl"
            >
              <Eye className="w-4 h-4 mr-2" />
              View All Posts
            </Button>
            <Button
              onClick={() => navigate('/admin/analytics')}
              variant="outline"
              className="w-full justify-start border-white/10 hover:bg-white/5 text-gray-300 hover:text-white rounded-xl"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
            <Button
              onClick={() => navigate('/admin/settings')}
              variant="outline"
              className="w-full justify-start border-white/10 hover:bg-white/5 text-gray-300 hover:text-white rounded-xl"
            >
              <FileText className="w-4 h-4 mr-2" />
              Site Settings
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
