import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Globe, Mail, Lock, Bell } from 'lucide-react';
import { Button } from './UI/button';
import { Input } from './UI/input';
import { toast } from 'sonner';
import { adminAuth } from '@/lib/admin-auth';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: 'CreataLab',
    siteUrl: 'https://creatalab.com',
    adminEmail: 'admin@creatalab.com',
    notifications: true,
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = () => {
    // Handle password change if user filled it in
    if (currentPassword || newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        toast.error('New password and confirmation do not match.');
        return;
      }
      const result = adminAuth.changePassword(currentPassword, newPassword);
      if (!result.ok) {
        if (result.reason === 'incorrect_current') {
          toast.error('Current password is incorrect.');
        } else if (result.reason === 'too_short') {
          toast.error('New password must be at least 8 characters.');
        } else {
          toast.error('Failed to change password.');
        }
        return;
      }
      toast.success('Admin password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      toast.success('Settings saved successfully!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your site configuration and preferences</p>
      </div>

      {/* General Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#111118] to-[#0a0a0f] rounded-2xl border border-white/10 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-bold text-white">General Settings</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 mb-2 block">Site Name</label>
            <Input
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <div>
            <label className="text-sm text-gray-300 mb-2 block">Site URL</label>
            <Input
              value={settings.siteUrl}
              onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
        </div>
      </motion.div>

      {/* Security Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-[#111118] to-[#0a0a0f] rounded-2xl border border-white/10 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-bold text-white">Security</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 mb-2 block">Admin Email</label>
            <Input
              type="email"
              value={settings.adminEmail}
              onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Current Admin Password</label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="bg-white/5 border-white/10 text-white"
              />
              <p className="mt-1 text-xs text-gray-500">
                Default password (if you haven&apos;t changed it yet): <span className="font-mono">{adminAuth.getCurrentPasswordLabel()}</span>
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-300 mb-2 block">New Admin Password</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="bg-white/5 border-white/10 text-white"
              />
              <label className="text-sm text-gray-300 mb-2 block mt-4">Confirm New Password</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-[#111118] to-[#0a0a0f] rounded-2xl border border-white/10 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-bold text-white">Notifications</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-medium">Email Notifications</p>
            <p className="text-sm text-gray-400">Receive email alerts for important events</p>
          </div>
          <button
            onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
            className={`w-14 h-7 rounded-full transition-colors ${settings.notifications ? 'bg-purple-600' : 'bg-gray-600'
              }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white transition-transform ${settings.notifications ? 'translate-x-7' : 'translate-x-1'
                }`}
            />
          </button>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-end"
      >
        <Button
          onClick={handleSave}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-full px-8 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </motion.div>
    </div>
  );
}
