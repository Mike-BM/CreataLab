import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart3,
  Users,
  Home,
  ChevronRight,
  FolderOpen,
  Bell,
  Search,
  User,
  Shield,
  Clock,
  Sparkles
} from 'lucide-react';
import { adminAuth } from '@/lib/admin-auth';
import { toast } from 'sonner';
import { appConfig } from '@/lib/config';

const adminMenuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: FileText, label: 'Insights & Sites', path: '/admin/posts' },
  { icon: FolderOpen, label: 'Portfolio', path: '/admin/portfolio' },
  { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
  { icon: Users, label: 'Users', path: '/admin/users' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!adminAuth.isAuthenticated()) {
      navigate('/admin/login');
    } else {
      setIsAuthenticated(true);
    }

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navigate]);

  const handleLogout = () => {
    adminAuth.logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#050508] text-gray-100 flex font-sans selection:bg-purple-500/30">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-72 flex-col fixed inset-y-0 left-0 z-50 p-6">
        <div className="glass-card h-full rounded-[2rem] flex flex-col border border-white/[0.05] overflow-hidden">
          {/* Brand */}
          <div className="p-8 border-b border-white/[0.03]">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-4 cursor-pointer"
              onClick={() => navigate('/admin/dashboard')}
            >
              <div className="w-12 h-12 rounded-2xl premium-gradient flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-white leading-none">creatalab</h1>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Admin Portal</p>
              </div>
            </motion.div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
            {adminMenuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 relative ${
                    isActive 
                      ? 'text-white' 
                      : 'text-gray-500 hover:text-gray-200 hover:bg-white/[0.03]'
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="active-pill"
                      className="absolute inset-0 premium-gradient opacity-10 rounded-2xl border border-white/10"
                    />
                  )}
                  <div className={`transition-colors duration-300 ${isActive ? 'text-purple-400' : 'group-hover:text-purple-400'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-sm tracking-wide">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto text-purple-400" />}
                </button>
              );
            })}
          </nav>

          {/* User Profile / Footer */}
          <div className="p-6 border-t border-white/[0.03] space-y-3">
            <div className="bg-white/[0.03] rounded-2xl p-4 flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                <User className="w-5 h-5 text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">Administrator</p>
                <p className="text-[10px] text-gray-500 font-medium truncate uppercase">Master Control</p>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center gap-3 px-5 py-3 rounded-xl text-gray-500 hover:text-white hover:bg-white/[0.03] transition-all font-bold text-xs uppercase tracking-wider"
            >
              <Home className="w-4 h-4" />
              <span>Preview Site</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-5 py-3 rounded-xl text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all font-bold text-xs uppercase tracking-wider"
            >
              <LogOut className="w-4 h-4" />
              <span>Secure Exit</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className={`h-24 sticky top-0 z-40 flex items-center justify-between px-8 transition-all duration-300 ${
          scrolled ? 'bg-[#050508]/80 backdrop-blur-xl h-20 border-b border-white/[0.05]' : 'bg-transparent'
        }`}>
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-12 h-12 rounded-xl glass-card flex items-center justify-center text-gray-400 hover:text-white transition-all"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Search/Command Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search administration commands (⌘K)..." 
              className="w-full h-12 bg-white/[0.03] border border-white/[0.08] focus:border-purple-500/50 rounded-2xl pl-12 pr-4 text-sm font-medium transition-all outline-none text-white focus:ring-4 focus:ring-purple-500/10"
            />
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-4">
            <button className="w-12 h-12 rounded-xl glass-card flex items-center justify-center text-gray-500 hover:text-purple-400 transition-all relative">
              <Bell className="w-5 h-5" />
              <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)] border-2 border-[#050508]" />
            </button>
            <div className="h-10 w-px bg-white/[0.05] mx-2 hidden sm:block" />
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Timezone</p>
              <p className="text-sm font-black text-white">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })} <span className="text-purple-400 font-bold">UTC</span></p>
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 p-8 lg:p-12 pb-24">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Navigation */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[80%] max-w-xs glass-card z-[70] lg:hidden p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/[0.05]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl premium-gradient flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black tracking-tight text-white">creatalab</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 space-y-2 overflow-y-auto">
                {adminMenuItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-sm font-bold ${
                      location.pathname === item.path ? 'premium-gradient text-white shadow-lg' : 'text-gray-400'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="mt-auto pt-6 border-t border-white/[0.05] space-y-4">
                <button onClick={handleLogout} className="w-full py-4 text-center rounded-xl bg-red-500/10 text-red-500 font-bold text-sm">
                  Log Out Control
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
