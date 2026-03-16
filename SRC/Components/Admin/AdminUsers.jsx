import { motion } from 'framer-motion';
import { Users, Mail, Calendar, Shield, MoreVertical, UserPlus, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from './ui/button';

const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', joined: '2024-01-15', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', joined: '2024-01-20', status: 'active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Viewer', joined: '2024-02-01', status: 'inactive' },
];

export default function AdminUsers() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl premium-gradient flex items-center justify-center text-white shadow-lg">
              <Users className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">USER <span className="text-gray-600">MANAGEMENT</span></h1>
          </div>
          <p className="text-gray-400 font-medium">Configure access levels and system permissions</p>
        </div>
        <Button className="premium-gradient text-white font-bold rounded-2xl px-8 h-14 shadow-lg hover:scale-105 transition-all">
          <UserPlus className="w-5 h-5 mr-3" />
          Provision New User
        </Button>
      </div>

      {/* Table Canvas */}
      <div className="glass-card rounded-[2.5rem] border border-white/[0.05] overflow-hidden">
         <div className="p-8 border-b border-white/[0.05] flex items-center justify-between">
            <h2 className="text-sm font-black text-white uppercase tracking-widest">Active Personnel</h2>
            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{mockUsers.length} total entries</div>
         </div>
         
         <div className="overflow-x-auto">
            <table className="w-full">
               <thead>
                  <tr className="text-left border-b border-white/[0.03]">
                     <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Identify</th>
                     <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Permission Level</th>
                     <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Operational Status</th>
                     <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/[0.03]">
                  {mockUsers.map((user, i) => (
                    <motion.tr 
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="group hover:bg-white/[0.02] transition-all"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/10 group-hover:border-purple-500/30 transition-colors">
                            <span className="text-white font-bold text-lg">{user.name[0]}</span>
                          </div>
                          <div>
                            <p className="text-white font-bold">{user.name}</p>
                            <p className="text-xs text-gray-500 font-medium">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center w-fit gap-2 ${
                          user.role === 'Admin' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'
                        }`}>
                          <Shield className="w-3 h-3" />
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                           <div className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-700'}`} />
                           <span className={`text-[10px] font-black uppercase tracking-widest ${user.status === 'active' ? 'text-green-400' : 'text-gray-600'}`}>
                             {user.status}
                           </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl text-gray-500 hover:text-white hover:bg-white/5">
                            <MoreVertical className="w-5 h-5" />
                         </Button>
                      </td>
                    </motion.tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
