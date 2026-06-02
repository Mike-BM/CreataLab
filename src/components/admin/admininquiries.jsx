import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Clock, 
  User, 
  MessageSquare, 
  Calendar, 
  Phone, 
  Search, 
  Filter, 
  ChevronRight, 
  Loader2,
  Trash2,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { Button } from './ui/button';
import { appConfig } from '@/lib/config';
import { adminAuth } from '@/lib/admin-auth';
import { toast } from 'sonner';

export default function AdminInquiries() {
  const [activeTab, setActiveTab] = useState('contact'); // 'contact' or 'bookings'
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = adminAuth.getToken();
      const endpoint = activeTab === 'contact' ? '/contact' : '/bookings';
      const response = await fetch(`${appConfig.api.base}${endpoint}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Data fetch failed');
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter(item => 
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (activeTab === 'bookings' && item.service?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${
              activeTab === 'contact' ? 'bg-blue-600' : 'bg-pink-600'
            }`}>
              {activeTab === 'contact' ? <Mail className="w-6 h-6" /> : <Calendar className="w-6 h-6" />}
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">
              {activeTab === 'contact' ? 'Inquiries' : 'Bookings'} <span className="text-gray-600">Stream</span>
            </h1>
          </div>
          <p className="text-gray-400 font-medium ml-15">Managing incoming communication from your platform</p>
        </div>

        <div className="flex bg-white/[0.03] p-1 rounded-2xl border border-white/5">
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'contact' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'
            }`}
          >
            Contact Messages
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'bookings' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'
            }`}
          >
            Booking Requests
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-white transition-colors" />
          <input
            type="text"
            placeholder={`Search ${activeTab === 'contact' ? 'messages' : 'bookings'} by name, email or content...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-14 bg-white/[0.03] border border-white/[0.08] focus:border-white/20 rounded-2xl pl-12 pr-4 text-sm font-medium outline-none text-white transition-all"
          />
        </div>
        <Button 
          variant="outline" 
          onClick={fetchData}
          className="h-14 px-6 rounded-2xl border-white/10 hover:bg-white/5 text-gray-400 font-bold"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Refresh Stream'}
        </Button>
      </div>

      {/* Content List */}
      <div className="space-y-4">
        {loading ? (
          <div className="h-64 glass-card rounded-3xl flex flex-col items-center justify-center gap-4 border border-white/5">
            <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Retrieving data stream...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="h-64 glass-card rounded-3xl flex flex-col items-center justify-center gap-4 border border-white/5">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-sm text-center px-4">
              {searchTerm ? 'No matches found for your search' : 'No incoming traffic detected in this stream'}
            </p>
          </div>
        ) : (
          filteredData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card rounded-3xl border border-white/[0.05] p-6 group hover:border-white/20 transition-all overflow-hidden relative"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Status indicator */}
                <div className={`hidden lg:block w-1.5 h-16 rounded-full self-center ${
                   activeTab === 'contact' ? 'bg-blue-500' : 'bg-pink-500'
                }`} />

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold leading-none mb-1">{item.name}</h3>
                        <p className="text-xs text-purple-400 font-medium uppercase tracking-widest">{item.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1 justify-end">
                          <Clock className="w-3 h-3" />
                          {new Date(item.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                          {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {activeTab === 'bookings' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-white/[0.02] p-3 rounded-xl border border-white/5">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Service Type</p>
                        <p className="text-sm font-bold text-pink-400">{item.service}</p>
                      </div>
                      <div className="bg-white/[0.02] p-3 rounded-xl border border-white/5">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Phone Number</p>
                        <p className="text-sm font-bold text-white">{item.phone || 'N/A'}</p>
                      </div>
                      <div className="bg-white/[0.02] p-3 rounded-xl border border-white/5">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Preferred Date</p>
                        <p className="text-sm font-bold text-blue-400">{item.preferred_date || 'None set'}</p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'contact' && (
                    <div className="mb-4">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Subject</p>
                      <h4 className="text-lg font-black text-white italic tracking-tight underline decoration-purple-500/30 underline-offset-4">"{item.subject}"</h4>
                    </div>
                  )}

                  <div className="bg-white/[0.03] p-6 rounded-2xl border border-white/[0.05] relative overflow-hidden group-hover:bg-white/[0.05] transition-colors">
                    <p className="text-gray-300 text-sm font-medium leading-relaxed whitespace-pre-wrap">{item.message}</p>
                  </div>
                </div>

                <div className="flex lg:flex-col items-center justify-center gap-2 pt-4 lg:pt-0 lg:pl-6 border-t lg:border-t-0 lg:border-l border-white/5">
                  <a 
                    href={`mailto:${item.email}`}
                    className="flex-1 lg:w-12 h-12 rounded-xl bg-white/[0.03] hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all group/btn"
                    title="Reply via Email"
                  >
                    <Mail className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                  </a>
                  {item.phone && (
                    <a 
                      href={`tel:${item.phone}`}
                      className="flex-1 lg:w-12 h-12 rounded-xl bg-white/[0.03] hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all group/btn"
                      title="Call Phone"
                    >
                      <Phone className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                    </a>
                  )}
                  <button 
                    className="flex-1 lg:w-12 h-12 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all group/btn"
                    title="Archive Entry"
                    onClick={() => toast.success('Entry archived')}
                  >
                    <Trash2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
