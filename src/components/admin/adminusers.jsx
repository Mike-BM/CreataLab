import { motion } from 'framer-motion';
import { Users, Mail, Calendar, Shield, MoreVertical, UserPlus, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from './ui/button';

import { useState, useEffect } from 'react';
import { appConfig } from '@/lib/config';
import { adminAuth } from '@/lib/admin-auth';
import { toast } from 'sonner';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = adminAuth.getToken();
        const response = await fetch(`${appConfig.api.base}/users`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          toast.error('Failed to load access protocols');
        }
      } catch (err) {
        console.error('User synchronization failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id, email) => {
    if (!confirm(`Confirm termination of administrative access for ${email}?`)) return;
    
    try {
      const token = adminAuth.getToken();
      const response = await fetch(`${appConfig.api.base}/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setUsers(users.filter(u => u.id !== id));
        toast.success('Access revoked successfully');
      } else {
        toast.error('Termination protocol failed');
      }
    } catch (err) {
      toast.error('Operation failed');
    }
  };
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
            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{users.length} total entries</div>
         </div>
         
         <div className="overflow-x-auto">
            {loading ? (
              <div className="p-20 flex flex-col items-center justify-center gap-4">
                <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest animate-pulse">Synchronizing Personnel...</p>
              </div>
            ) : (
              <table className="w-full">
                 <thead>
                    <tr className="text-left border-b border-white/[0.03]">
                       <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Identify</th>
                       <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Operational Status</th>
                       <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/[0.03]">
                    {users.map((user, i) => (
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
                              <span className="text-white font-bold text-lg">{user.email[0].toUpperCase()}</span>
                            </div>
                            <div>
                              <p className="text-white font-bold">{user.email.split('@')[0].replace('.', ' ')}</p>
                              <p className="text-xs text-gray-500 font-medium">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                             <span className="text-[10px] font-black uppercase tracking-widest text-green-400">
                               Authorized
                             </span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <Button 
                             variant="ghost" 
                             size="icon" 
                             onClick={() => handleDelete(user.id, user.email)}
                             className="w-10 h-10 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                           >
                              <XCircle className="w-5 h-5" />
                           </Button>
                        </td>
                      </motion.tr>
                    ))}
                 </tbody>
              </table>
            )}
         </div>
      </div>
    </div>
  );
}
