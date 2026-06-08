import { useState, useEffect } from 'react';
import { Download, Plus, Trash2, KeyRound, Upload, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Textarea } from '@/ui/textarea';
import { toast } from 'sonner';
import { appConfig } from '@/lib/config';
import { adminAuth } from '@/lib/admin-auth';

const CATEGORIES = [
  'Countdown Posters',
  'Event Flyers',
  'Social Media Graphics',
  'Official Documents',
  'Logos and Brand Assets',
  'Marketing Resources'
];

export default function AdminMedia() {
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [isSavingCode, setIsSavingCode] = useState(false);
  const [orgLogo, setOrgLogo] = useState('');
  const [orgColor, setOrgColor] = useState('#A855F7');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: CATEGORIES[0],
    file_url: '',
    thumbnail_url: ''
  });

  const fetchResources = async () => {
    try {
      const token = adminAuth.getToken();
      const response = await fetch(`${appConfig.api.base}/admin/media`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setResources(await response.json());
      }
    } catch (err) {
      toast.error('Failed to load media resources.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const token = adminAuth.getToken();
      const response = await fetch(`${appConfig.api.base}/settings`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (response.ok) {
        const data = await response.json();
        if (data.media_hub_code) {
          setAccessCode(data.media_hub_code);
        }
        if (data.media_hub_org_logo) {
          setOrgLogo(data.media_hub_org_logo);
        }
        if (data.media_hub_org_color) {
          setOrgColor(data.media_hub_org_color);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchResources();
    fetchSettings();
  }, []);

  const handleSaveCode = async () => {
    if (!accessCode.trim()) return toast.error('Code cannot be empty');
    setIsSavingCode(true);
    try {
      const token = adminAuth.getToken();
      const response = await fetch(`${appConfig.api.base}/settings/media_hub_code`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ value: accessCode.trim() })
      });
      const response2 = await fetch(`${appConfig.api.base}/settings/media_hub_org_logo`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ value: orgLogo })
      });
      const response3 = await fetch(`${appConfig.api.base}/settings/media_hub_org_color`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ value: orgColor })
      });
      if (response.ok && response2.ok && response3.ok) {
        toast.success('Access Code & Branding updated successfully');
      } else {
        toast.error('Failed to update settings');
      }
    } catch (error) {
      toast.error('Error saving settings');
    } finally {
      setIsSavingCode(false);
    }
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const toastId = toast.loading(`Uploading ${type}...`);
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);

      const token = adminAuth.getToken();
      const response = await fetch(`${appConfig.api.base}/admin/files/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: uploadData
      });

      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      
      if (type === 'org_logo') {
        setOrgLogo(data.url);
      } else {
        setFormData(prev => ({...prev, [type === 'thumbnail' ? 'thumbnail_url' : 'file_url']: data.url}));
      }
      toast.success(`${type} uploaded`, { id: toastId });
    } catch (error) {
      toast.error('Upload failed', { id: toastId });
    } finally {
      setIsUploading(false);
      e.target.value = null;
    }
  };

  const handleAddResource = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.file_url) return toast.error('Title and File are required');

    setIsUploading(true);
    const toastId = toast.loading('Adding resource...');
    try {
      const token = adminAuth.getToken();
      const response = await fetch(`${appConfig.api.base}/admin/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to add resource');
      toast.success('Resource added', { id: toastId });
      
      setFormData({
        title: '', description: '', category: CATEGORIES[0], file_url: '', thumbnail_url: ''
      });
      fetchResources();
    } catch (err) {
      toast.error('Failed to add resource', { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this resource?')) return;
    try {
      const token = adminAuth.getToken();
      const response = await fetch(`${appConfig.api.base}/admin/media/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        toast.success('Resource deleted');
        setResources(prev => prev.filter(r => r.id !== id));
      } else {
        toast.error('Failed to delete resource');
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading resources...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">Media <span className="text-gray-600">Hub</span></h1>
          <p className="text-gray-400 font-medium">Manage secure downloads and access codes</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="glass-card rounded-[2.5rem] p-8 border border-white/[0.05] space-y-6">
            <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
              <Plus className="w-4 h-4 text-purple-400" /> Add New Resource
            </h2>
            <form onSubmit={handleAddResource} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase">Title</label>
                  <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="bg-white/[0.03] border-white/[0.08]" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full h-10 bg-white/[0.03] border border-white/[0.08] rounded-md px-3 text-sm text-white">
                    {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#111118]">{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase">Description</label>
                <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="bg-white/[0.03] border-white/[0.08]" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-purple-400 uppercase">Main File (PDF, ZIP, PNG...)</label>
                  <div className="flex gap-2">
                    <Input readOnly value={formData.file_url} placeholder="Upload file..." className="bg-white/[0.03] border-white/[0.08] text-xs" />
                    <Button type="button" variant="ghost" className="relative premium-gradient rounded-md p-2 w-10 shrink-0">
                      <Upload className="w-4 h-4 text-white" />
                      <input type="file" onChange={e => handleFileUpload(e, 'file')} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-pink-400 uppercase">Thumbnail (Image)</label>
                  <div className="flex gap-2">
                    <Input readOnly value={formData.thumbnail_url} placeholder="Optional preview..." className="bg-white/[0.03] border-white/[0.08] text-xs" />
                    <Button type="button" variant="ghost" className="relative bg-white/5 rounded-md p-2 w-10 shrink-0 border border-pink-500/20">
                      <Upload className="w-4 h-4 text-pink-400" />
                      <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'thumbnail')} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </Button>
                  </div>
                </div>
              </div>
              <Button type="submit" disabled={isUploading} className="w-full premium-gradient font-bold h-12 rounded-xl mt-4">
                {isUploading ? 'Processing...' : 'Publish Resource'}
              </Button>
            </form>
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-black text-white uppercase tracking-widest pl-2">Uploaded Resources ({resources.length})</h2>
            <div className="grid gap-4">
              {resources.map(res => (
                <div key={res.id} className="glass-card rounded-2xl p-4 border border-white/[0.05] flex items-center justify-between group">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                      {res.thumbnail_url ? <img src={res.thumbnail_url} alt="" className="w-full h-full object-cover" /> : <Download className="w-5 h-5 text-gray-500" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-white text-sm truncate">{res.title}</h3>
                      <div className="flex items-center gap-3 text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">
                        <span>{res.category}</span>
                        <span>•</span>
                        <span className="text-purple-400">{res.downloads_count} Downloads</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-4">
                     <a href={res.file_url} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                       <Download className="w-4 h-4" />
                     </a>
                     <button onClick={() => handleDelete(res.id)} className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-colors">
                       <Trash2 className="w-4 h-4" />
                     </button>
                  </div>
                </div>
              ))}
              {resources.length === 0 && <div className="text-center p-8 text-gray-500 text-sm">No resources available.</div>}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="glass-card rounded-[2.5rem] p-8 border border-red-500/20 bg-gradient-to-b from-red-500/5 to-transparent space-y-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -z-10" />
             <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
                   <KeyRound className="w-5 h-5" />
                </div>
                <div>
                   <h2 className="text-sm font-black text-white uppercase tracking-widest">Access Security</h2>
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Global Master Key</p>
                </div>
             </div>
             
             <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase">Current Access Code</label>
                  <div className="relative">
                    <Input 
                      type={showCode ? 'text' : 'password'}
                      value={accessCode}
                      onChange={e => setAccessCode(e.target.value)}
                      className="bg-black/40 border-red-500/30 focus:border-red-500 h-14 rounded-xl text-white font-bold tracking-[0.2em] pr-12 text-center"
                    />
                    <button type="button" onClick={() => setShowCode(!showCode)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                      {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase">Organization Logo (Optional)</label>
                  <div className="flex gap-2 items-center">
                    {orgLogo && (
                      <div className="w-14 h-14 rounded-lg bg-black/40 border border-red-500/30 flex items-center justify-center p-2 shrink-0">
                        <img src={orgLogo} alt="Org Logo" className="max-w-full max-h-full object-contain" />
                      </div>
                    )}
                    <div className="flex-1 relative h-14 bg-black/40 border border-red-500/30 rounded-xl flex items-center justify-center cursor-pointer hover:bg-red-500/10 transition-colors">
                      <span className="text-xs font-bold text-gray-400">{orgLogo ? 'Change Logo' : 'Upload Logo'}</span>
                      <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'org_logo')} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase">Brand Primary Color</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={orgColor} 
                      onChange={e => setOrgColor(e.target.value)}
                      className="w-14 h-14 rounded-xl cursor-pointer bg-black/40 border border-red-500/30 p-1"
                    />
                    <Input 
                      type="text" 
                      value={orgColor} 
                      onChange={e => setOrgColor(e.target.value)}
                      className="flex-1 bg-black/40 border-red-500/30 focus:border-red-500 h-14 rounded-xl text-white font-bold tracking-widest uppercase text-center"
                    />
                  </div>
                </div>

                <Button onClick={handleSaveCode} disabled={isSavingCode} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold h-12 rounded-xl mt-4">
                  {isSavingCode ? 'Updating...' : 'Update Settings'}
                </Button>
                <p className="text-[10px] text-gray-500 font-medium text-center">
                  Changing this code will require all current users to enter the new code to access the Media Hub.
                </p>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
}
