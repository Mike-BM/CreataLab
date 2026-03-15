import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Globe, Mail, Lock, Bell, Settings, Shield, ShieldCheck, Cpu } from 'lucide-react';
import { Button } from './UI/button';
import { Input } from './UI/input';
import { toast } from 'sonner';
import { adminAuth } from '@/Lib/admin-auth';
import { appConfig } from '@/Lib/config';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: 'CreataLab',
    siteUrl: 'https://creatalab.com',
    adminEmail: 'admin@creatalab.com',
    notifications: true,
  });
  
  const [maintenance, setMaintenance] = useState({ active: false, message: '' });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${appConfig.api.base}/settings`);
        if (response.ok) {
          const data = await response.json();
          if (data.maintenance_mode) setMaintenance(data.maintenance_mode);
        }
      } catch (err) {
        console.error('Failed to sync system parameters:', err);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading('Synchronizing system configuration...');
    
    try {
      const token = adminAuth.getToken();
      
      // Update maintenance mode
      await fetch(`${appConfig.api.base}/settings/maintenance_mode`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ value: maintenance })
      });

      // Handle password change if user filled it in
      if (currentPassword || newPassword || confirmPassword) {
        if (newPassword !== confirmPassword) {
          toast.error('Cryptographic mismatch: Passwords do not align.', { id: toastId });
          setIsSaving(false);
          return;
        }
        const result = await adminAuth.changePassword(currentPassword, newPassword);
        if (!result.ok) {
          const errorMsg = result.reason === 'incorrect_current' 
            ? 'Authentication failed: Current key is invalid.' 
            : result.reason === 'too_short' 
            ? 'Security violation: Key length insufficient.' 
            : 'Configuration breach: Password update failed.';
          toast.error(errorMsg, { id: toastId });
          setIsSaving(false);
          return;
        }
        toast.success('Security protocols updated: Admin key synchronized.', { id: toastId });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.success('System parameters optimized and saved.', { id: toastId });
      }
    } catch (err) {
      toast.error('Sync failed: Connection lost', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl premium-gradient flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              <Settings className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">SYSTEM <span className="text-gray-600">PREFERENCES</span></h1>
          </div>
          <p className="text-gray-400 font-medium">Global configuration and security protocols</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="premium-gradient text-white font-bold rounded-2xl px-10 h-14 shadow-lg hover:scale-105 transition-all"
        >
          <Save className="w-5 h-5 mr-3" />
          {isSaving ? 'Syncing...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid gap-8">
        {/* Maintenance Matrix */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-[2.5rem] p-8 md:p-10 border border-white/[0.05] space-y-8 border-l-4 border-l-orange-500/50"
        >
          <div className="flex items-center justify-between pb-6 border-b border-white/[0.05]">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${maintenance.active ? 'bg-orange-500/20 text-orange-400' : 'bg-white/[0.03] text-gray-600'}`}>
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">Maintenance Mode</h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Global system interruption protocol</p>
              </div>
            </div>
            
            <button
              onClick={() => setMaintenance({ ...maintenance, active: !maintenance.active })}
              className={`relative w-16 h-8 rounded-full transition-all duration-300 ${maintenance.active ? 'bg-orange-600 shadow-[0_0_15px_rgba(249,115,22,0.4)]' : 'bg-white/[0.05]'}`}
            >
              <motion.div
                animate={{ x: maintenance.active ? 32 : 4 }}
                className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg"
              />
            </button>
          </div>

          <div className="space-y-4">
             <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Status Transmission Message</label>
             <textarea
              value={maintenance.message}
              onChange={(e) => setMaintenance({ ...maintenance, message: e.target.value })}
              placeholder="System optimization in progress. We will be back shortly."
              className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-orange-500/40 min-h-[100px] rounded-2xl text-sm font-medium text-gray-200 p-6 leading-relaxed outline-none transition-all"
            />
          </div>
        </motion.section>

        {/* Global Notifications */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-[2.5rem] p-8 border border-white/[0.05]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${settings.notifications ? 'bg-purple-600/10 text-purple-400 shadow-inner shadow-purple-500/20' : 'bg-white/[0.03] text-gray-600'}`}>
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-black uppercase tracking-widest text-sm leading-none mb-2">Signal Transmission</h3>
                <p className="text-xs text-gray-500 font-medium tracking-tight">Email alerts for critical system events and security audits</p>
              </div>
            </div>
            
            <button
              onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
              className={`relative w-16 h-8 rounded-full transition-all duration-300 ${settings.notifications ? 'bg-purple-600 shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'bg-white/[0.05]'}`}
            >
              <motion.div
                animate={{ x: settings.notifications ? 32 : 4 }}
                className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg"
              />
            </button>
          </div>
        </motion.section>

        {/* Core Identity */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-[2.5rem] p-8 md:p-10 border border-white/[0.05] space-y-8"
        >
          <div className="flex items-center gap-3 pb-6 border-b border-white/[0.05]">
            <Globe className="w-5 h-5 text-purple-400" />
            <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">Environmental Scope</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Platform Alias</label>
              <Input
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="bg-white/[0.03] border-white/[0.08] focus:border-purple-500/50 h-14 rounded-2xl text-white font-bold"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Root URL</label>
              <Input
                value={settings.siteUrl}
                onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                className="bg-white/[0.03] border-white/[0.08] focus:border-purple-500/50 h-14 rounded-2xl text-white font-bold"
              />
            </div>
          </div>
        </motion.section>

        {/* Security Matrix */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-[2.5rem] p-8 md:p-10 border border-white/[0.05] space-y-8 border-l-4 border-l-purple-500/50"
        >
          <div className="flex items-center gap-3 pb-6 border-b border-white/[0.05]">
            <Lock className="w-5 h-5 text-blue-400" />
            <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">Access Protocols</h2>
          </div>
          
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Primary Admin Identity</label>
              <Input
                type="email"
                value={settings.adminEmail}
                onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                className="bg-white/[0.03] border-white/[0.08] focus:border-blue-500/50 h-14 rounded-2xl text-white font-bold max-w-md"
              />
            </div>

            <div className="h-px bg-white/[0.03]" />

            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Master Access Key</label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter active key"
                  className="bg-white/[0.03] border-white/[0.08] h-14 rounded-2xl text-white text-xs"
                />
                <div className="flex items-center gap-2 mt-2 ml-1">
                   <ShieldCheck className="w-3 h-3 text-purple-400" />
                   <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Active Key: {adminAuth.getCurrentPasswordLabel()}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Initialize New Key</label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="8+ characters"
                  className="bg-white/[0.03] border-white/[0.08] h-14 rounded-2xl text-white text-xs"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Verify New Key</label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm entry"
                  className="bg-white/[0.03] border-white/[0.08] h-14 rounded-2xl text-white text-xs"
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Global Notifications */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-[2.5rem] p-8 border border-white/[0.05]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${settings.notifications ? 'bg-purple-600/10 text-purple-400 shadow-inner shadow-purple-500/20' : 'bg-white/[0.03] text-gray-600'}`}>
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-black uppercase tracking-widest text-sm leading-none mb-2">Signal Transmission</h3>
                <p className="text-xs text-gray-500 font-medium tracking-tight">Email alerts for critical system events and security audits</p>
              </div>
            </div>
            
            <button
              onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
              className={`relative w-16 h-8 rounded-full transition-all duration-300 ${settings.notifications ? 'bg-purple-600 shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'bg-white/[0.05]'}`}
            >
              <motion.div
                animate={{ x: settings.notifications ? 32 : 4 }}
                className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg"
              />
            </button>
          </div>
        </motion.section>

        {/* Diagnostics Info */}
        <div className="flex items-center justify-center gap-12 pt-10">
           <div className="text-center">
              <Cpu className="w-5 h-5 text-gray-800 mx-auto mb-2" />
              <p className="text-[8px] font-black text-gray-700 uppercase tracking-[0.3em]">Core v4.0.2</p>
           </div>
           <div className="text-center">
              <Shield className="w-5 h-5 text-gray-800 mx-auto mb-2" />
              <p className="text-[8px] font-black text-gray-700 uppercase tracking-[0.3em]">SSL Verified</p>
           </div>
        </div>
      </div>
    </div>
  );
}
