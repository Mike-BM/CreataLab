import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Globe, Lock, Bell, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from './UI/button';
import { Input } from './UI/input';
import { toast } from 'sonner';
import { adminAuth } from '@/Lib/admin-auth';
import { appConfig } from '@/Lib/config';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: appConfig.company.name,
    siteUrl: 'https://creatalab.com',
    notifications: true,
  });

  // Password change
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const passwordStrength = (pwd) => {
    if (!pwd) return null;
    if (pwd.length < 8) return { label: 'Too short', color: 'bg-red-500', width: '25%' };
    if (pwd.length < 10) return { label: 'Weak', color: 'bg-orange-500', width: '40%' };
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd))
      return { label: 'Strong', color: 'bg-green-500', width: '100%' };
    return { label: 'Fair', color: 'bg-yellow-500', width: '65%' };
  };

  const strength = passwordStrength(newPassword);

  const handleUpdateAccount = async (e) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error('Current password is required to make changes.');
      return;
    }

    if (!newEmail && !newPassword) {
      toast.error('Please specify a new email or a new password.');
      return;
    }

    if (newPassword) {
      if (newPassword !== confirmPassword) {
        toast.error('New password and confirmation do not match.');
        return;
      }
      if (newPassword.length < 8) {
        toast.error('New password must be at least 8 characters.');
        return;
      }
    }

    if (newEmail && !/^\S+@\S+\.\S+$/.test(newEmail)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setIsUpdating(true);
    try {
      const result = await adminAuth.updateAccount(currentPassword, newEmail || null, newPassword || null);
      if (!result.ok) {
        const errorMessages = {
          incorrect_current: 'Current password is incorrect.',
          too_short: 'New password must be at least 8 characters.',
          email_exists: 'This email is already in use.',
          invalid_email: 'Please enter a valid email address.',
          network_error: 'Network error. Make sure the server is running.',
        };
        toast.error(errorMessages[result.reason] || 'Failed to update account. Please try again.');
        return;
      }
      
      toast.success('Account updated successfully! Please log in again.');
      setNewEmail('');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Log out so they re-authenticate with the new credentials
      setTimeout(() => {
        adminAuth.logout();
        window.location.href = '/admin/login';
      }, 1500);
    } finally {
      setIsUpdating(false);
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
          <div className="flex justify-end pt-2">
            <Button
              onClick={() => toast.success('Settings saved!')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-full px-6 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Change Password */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-[#111118] to-[#0a0a0f] rounded-2xl border border-white/10 p-6"
      >
        <div className="flex items-center gap-3 mb-1">
          <Lock className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-bold text-white">Security & Account</h2>
        </div>
        <p className="text-gray-500 text-sm mb-6 ml-8">
          Manage your login credentials. You'll need your current password to save changes.
        </p>

        <form onSubmit={handleUpdateAccount} className="space-y-4">
          {/* New Email */}
          <div>
            <label className="text-sm text-gray-300 mb-2 block">New Email Address (Optional)</label>
            <Input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter new admin email"
              className="bg-white/5 border-white/10 text-white"
            />
            <p className="text-[10px] text-gray-500 mt-1 italic">Leave blank to keep your current email address</p>
          </div>
          {/* Current Password */}
          <div>
            <label className="text-sm text-gray-300 mb-2 block">Current Password</label>
            <div className="relative">
              <Input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                className="bg-white/5 border-white/10 text-white pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="text-sm text-gray-300 mb-2 block">New Password</label>
            <div className="relative">
              <Input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="bg-white/5 border-white/10 text-white pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNew(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {/* Strength bar */}
            {strength && (
              <div className="mt-2 space-y-1">
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                    style={{ width: strength.width }}
                  />
                </div>
                <p className={`text-xs ${
                  strength.label === 'Strong' ? 'text-green-400' :
                  strength.label === 'Fair' ? 'text-yellow-400' : 'text-red-400'
                }`}>{strength.label}</p>
              </div>
            )}
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="text-sm text-gray-300 mb-2 block">Confirm New Password</label>
            <div className="relative">
              <Input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className={`bg-white/5 border-white/10 text-white pr-10 ${
                  confirmPassword && confirmPassword !== newPassword ? 'border-red-500/50' :
                  confirmPassword && confirmPassword === newPassword ? 'border-green-500/50' : ''
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {confirmPassword && confirmPassword === newPassword && (
              <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Passwords match
              </p>
            )}
            {confirmPassword && confirmPassword !== newPassword && (
              <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isUpdating}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-full px-6 flex items-center gap-2 disabled:opacity-60"
            >
              {isUpdating ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</>
              ) : (
                <><Save className="w-4 h-4" /> Save Changes</>
              )}
            </Button>
          </div>
        </form>
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
            className={`w-14 h-7 rounded-full transition-colors ${settings.notifications ? 'bg-purple-600' : 'bg-gray-600'}`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white transition-transform ${settings.notifications ? 'translate-x-7' : 'translate-x-1'}`}
            />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
