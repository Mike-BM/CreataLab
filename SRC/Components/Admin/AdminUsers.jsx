import { motion } from 'framer-motion';
import { Users, Mail, Calendar, Shield } from 'lucide-react';

const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', joined: '2024-01-15', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', joined: '2024-01-20', status: 'active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Viewer', joined: '2024-02-01', status: 'inactive' },
];

export default function AdminUsers() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Users</h1>
        <p className="text-gray-400">Manage user accounts and permissions</p>
      </div>

      {/* Users List */}
      <div className="bg-gradient-to-br from-[#111118] to-[#0a0a0f] rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white">All Users</h2>
          </div>
        </div>
        <div className="divide-y divide-white/5">
          {mockUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600/30 to-pink-600/30 flex items-center justify-center">
                    <span className="text-white font-semibold">{user.name[0]}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{user.name}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-gray-400 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </span>
                      <span className="text-sm text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(user.joined).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.role === 'Admin'
                      ? 'bg-purple-500/20 text-purple-300'
                      : user.role === 'Editor'
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-gray-500/20 text-gray-300'
                  }`}>
                    <Shield className="w-3 h-3 inline mr-1" />
                    {user.role}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.status === 'active'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {user.status}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
