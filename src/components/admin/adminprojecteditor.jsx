import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  FileText, 
  Image as ImageIcon, 
  Briefcase, 
  Tag, 
  Link as LinkIcon,
  Globe,
  Settings,
  Sparkles,
  Rocket,
  Upload
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { appConfig } from '@/lib/config';
import { adminAuth } from '@/lib/admin-auth';

export default function AdminProjectEditor({ mode = 'create' }) {
    const navigate = useNavigate();
    const { id } = useParams();

    const [isLoading, setIsLoading] = useState(mode === 'edit');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availableImages, setAvailableImages] = useState([]);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        image_url: '',
        description: '',
        full_description: '',
        client: '',
        tools: '',
        features: '',
        link: '',
        problem: '',
        solution: '',
        impact: '',
        published: true,
    });

    useEffect(() => {
        if (mode === 'edit' && id) {
            const loadProject = async () => {
                try {
                    const response = await fetch(`${appConfig.api.base}/projects/${id}`);
                    if (!response.ok) throw new Error('Failed to load project');
                    const data = await response.json();
                    setFormData({
                        title: data.title ?? '',
                        category: data.category ?? '',
                        image_url: data.image_url ?? '',
                        description: data.description ?? '',
                        full_description: data.full_description ?? '',
                        client: data.client ?? '',
                        tools: data.tools ? data.tools.join(', ') : '',
                        features: data.features ? data.features.join(', ') : '',
                        link: data.link ?? '',
                        problem: data.problem ?? '',
                        solution: data.solution ?? '',
                        impact: data.impact ?? '',
                        published: Boolean(data.published),
                    });
                } catch (error) {
                    console.error('Error loading project:', error);
                    toast.error('Failed to retrieve project record');
                } finally {
                    setIsLoading(false);
                }
            };
            loadProject();
        }
        
        const fetchImages = async () => {
            try {
                const token = adminAuth.getToken();
                const response = await fetch(`${appConfig.api.base}/admin/images`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setAvailableImages(data);
                }
            } catch (error) {
                console.error("Error fetching local images:", error);
            }
        };
        fetchImages();
    }, [mode, id]);

    const handleChange = (field) => (e) => {
        const value = field === 'published' ? e.target.checked : e.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingImage(true);
        try {
            const uploadData = new FormData();
            uploadData.append('image', file);

            const token = adminAuth.getToken();
            const response = await fetch(`${appConfig.api.base}/admin/images/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: uploadData
            });

            if (!response.ok) throw new Error('Upload failed');
            const data = await response.json();
            
            setFormData(prev => ({...prev, image_url: data.url}));
            toast.success('Image securely uploaded');
            
            if (!availableImages.includes(data.url)) {
                setAvailableImages(prev => [data.url, ...prev]);
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error('File injection failed.');
        } finally {
            setIsUploadingImage(false);
            e.target.value = null; // reset input
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload = {
            ...formData,
            tools: formData.tools ? formData.tools.split(',').map(s => s.trim()) : [],
            features: formData.features ? formData.features.split(',').map(s => s.trim()) : [],
        };

        try {
            const endpoint = mode === 'edit' && id
                ? `${appConfig.api.base}/projects/${id}`
                : `${appConfig.api.base}/projects`;
            const method = mode === 'edit' && id ? 'PUT' : 'POST';

            const token = adminAuth.getToken();

            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Failed to save project');

            toast.success(`Project ${mode === 'edit' ? 'updated' : 'initialized'} successfully.`);
            navigate('/admin/portfolio');
        } catch (error) {
            console.error('Error saving project:', error);
            toast.error('Data persistence failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="h-96 glass-card rounded-[2.5rem] flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest animate-pulse">Syncing Asset Data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            {/* Navigation & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        className="w-12 h-12 glass-card rounded-xl text-gray-400 hover:text-white transition-all flex items-center justify-center p-0"
                        onClick={() => navigate('/admin/portfolio')}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight uppercase">
                            {mode === 'edit' ? 'Update' : 'Initialize'} <span className="text-gray-600">Asset</span>
                        </h1>
                        <p className="text-gray-400 font-medium">Configure project parameters and metadata</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => setFormData(prev => ({ ...prev, published: !prev.published }))}
                        className={`h-14 rounded-2xl px-6 font-bold text-xs uppercase tracking-widest transition-all gap-3 ${
                            formData.published 
                              ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                              : 'bg-white/[0.03] text-gray-400 border border-white/[0.08]'
                        }`}
                    >
                        {formData.published ? <Rocket className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border border-current" />}
                        {formData.published ? 'Deployment Active' : 'Staging Mode'}
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="premium-gradient text-white font-bold rounded-2xl px-10 h-14 shadow-lg hover:scale-105 active:scale-95 transition-all"
                    >
                        <Save className="w-5 h-5 mr-3" />
                        {isSubmitting ? 'Syncing...' : 'Save Asset'}
                    </Button>
                </div>
            </div>

            {/* Form Canvas */}
            <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: Core Identity */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="glass-card rounded-[2.5rem] p-8 md:p-10 border border-white/[0.05] space-y-8">
                        <div className="flex items-center gap-3 pb-6 border-b border-white/[0.05]">
                            <Sparkles className="w-5 h-5 text-purple-400" />
                            <h2 className="text-sm font-black text-white uppercase tracking-widest">General Information</h2>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Project Title</label>
                                <Input
                                    value={formData.title}
                                    onChange={handleChange('title')}
                                    placeholder="e.g. Neo-Design System"
                                    required
                                    className="bg-white/[0.03] border-white/[0.08] focus:border-purple-500/50 h-14 rounded-2xl text-white font-bold"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Asset Category</label>
                                <select
                                    value={formData.category}
                                    onChange={handleChange('category')}
                                    required
                                    className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-purple-500/50 h-14 rounded-2xl text-white font-bold px-4 appearance-none hover:bg-white/[0.06] transition-colors cursor-pointer"
                                >
                                    <option value="" disabled className="bg-[#111118]">Select Category</option>
                                    <option value="Branding & Marketing Assets" className="bg-[#111118]">Branding & Marketing Assets</option>
                                    <option value="Digital" className="bg-[#111118]">Digital</option>
                                    <option value="Data" className="bg-[#111118]">Data</option>
                                    <option value="AI Solutions" className="bg-[#111118]">AI Solutions</option>
                                </select>
                            </div>
                        </div>

                        {formData.category === 'Branding & Marketing Assets' && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="space-y-3 p-5 rounded-2xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20"
                            >
                                <label className="text-[10px] font-black text-pink-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Sparkles className="w-3 h-3" /> Quick Template Fill
                                </label>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setFormData(prev => ({
                                            ...prev,
                                            title: 'Apparel & Merch Mockups',
                                            description: 'Stylish, photorealistic mockups for apparel and merchandise—designed to showcase branding in a clean, modern, and impactful way.'
                                        }))}
                                        className="bg-black/20 hover:bg-pink-500/20 border border-white/5 hover:border-pink-500/50 h-auto py-4 px-5 rounded-xl flex flex-col items-start gap-2 transition-all justify-start"
                                    >
                                        <span className="text-sm font-black text-white text-left w-full">1. Apparel & Merch Mockups</span>
                                        <span className="text-[10px] text-gray-400 leading-relaxed text-left w-full whitespace-normal font-medium">Stylish, photorealistic mockups for apparel and merchandise...</span>
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setFormData(prev => ({
                                            ...prev,
                                            title: 'Collateral Design Suite',
                                            description: 'A collection of creative designs including posters, flyers, logos, banners, and certificates—crafted to capture attention and communicate ideas across events, promotions, and everyday moments.'
                                        }))}
                                        className="bg-black/20 hover:bg-pink-500/20 border border-white/5 hover:border-pink-500/50 h-auto py-4 px-5 rounded-xl flex flex-col items-start gap-2 transition-all justify-start"
                                    >
                                        <span className="text-sm font-black text-white text-left w-full">2. Collateral Design Suite</span>
                                        <span className="text-[10px] text-gray-400 leading-relaxed text-left w-full whitespace-normal font-medium">A collection of creative designs including posters, flyers, logos...</span>
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Overview Description</label>
                            <Textarea
                                value={formData.description}
                                onChange={handleChange('description')}
                                placeholder="Concise summary for discovery feeds..."
                                required
                                className="bg-white/[0.03] border-white/[0.08] focus:border-purple-500/50 min-h-[100px] rounded-2xl text-white font-medium p-6"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Deep Dive (Full Details)</label>
                            <Textarea
                                value={formData.full_description}
                                onChange={handleChange('full_description')}
                                placeholder="Elaborate on the project scope and execution..."
                                className="bg-white/[0.03] border-white/[0.08] focus:border-purple-500/50 min-h-[180px] rounded-2xl text-white font-medium p-6"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 pt-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Tools & Technologies</label>
                                <Input
                                    value={formData.tools}
                                    onChange={handleChange('tools')}
                                    placeholder="React, Supabase, Tailwind..."
                                    className="bg-white/[0.03] border-white/[0.08] focus:border-purple-500/50 h-14 rounded-2xl text-white font-medium pl-4"
                                />
                                <p className="text-[8px] text-gray-600 uppercase font-black tracking-widest pl-1">Comma-separated list</p>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Key Features</label>
                                <Input
                                    value={formData.features}
                                    onChange={handleChange('features')}
                                    placeholder="Real-time sync, Auth, Analytics..."
                                    className="bg-white/[0.03] border-white/[0.08] focus:border-purple-500/50 h-14 rounded-2xl text-white font-medium pl-4"
                                />
                                <p className="text-[8px] text-gray-600 uppercase font-black tracking-widest pl-1">Comma-separated list</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 pt-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">The Problem</label>
                                <Textarea
                                    value={formData.problem}
                                    onChange={handleChange('problem')}
                                    placeholder="What was the challenge?"
                                    className="bg-white/[0.03] border-white/[0.08] focus:border-red-500/50 min-h-[120px] rounded-2xl text-white font-medium p-4 text-sm"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">The Solution</label>
                                <Textarea
                                    value={formData.solution}
                                    onChange={handleChange('solution')}
                                    placeholder="How did we solve it?"
                                    className="bg-white/[0.03] border-white/[0.08] focus:border-green-500/50 min-h-[120px] rounded-2xl text-white font-medium p-4 text-sm"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">The Impact</label>
                                <Textarea
                                    value={formData.impact}
                                    onChange={handleChange('impact')}
                                    placeholder="What was the result?"
                                    className="bg-white/[0.03] border-white/[0.08] focus:border-blue-500/50 min-h-[120px] rounded-2xl text-white font-medium p-4 text-sm"
                                />
                            </div>
                        </div>
                    </section>


                </div>

                {/* Right Column: Metadata & Assets */}
                <div className="space-y-8">
                    <section className="glass-card rounded-[2.5rem] p-8 border border-white/[0.05] space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <ImageIcon className="w-5 h-5 text-pink-400" />
                            <h2 className="text-sm font-black text-white uppercase tracking-widest">Media Assets</h2>
                        </div>
                        
                        <div className="aspect-video rounded-2xl overflow-hidden bg-black/40 border border-white/5 mb-4 group relative">
                            {formData.image_url ? (
                                <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-700">
                                    <ImageIcon className="w-12 h-12" />
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                             <div className="space-y-2">
                                 <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Cover Photo (URL/Path)</label>
                                 <Input
                                    value={formData.image_url}
                                    onChange={handleChange('image_url')}
                                    placeholder="https://cdn.creatalab.com/... or /7.png"
                                    required
                                    className="bg-white/[0.03] border-white/[0.08] focus:border-pink-500/50 h-12 rounded-xl text-xs"
                                 />
                             </div>

                             {availableImages.length > 0 && (
                                 <div className="space-y-2">
                                     <label className="text-[10px] font-black text-pink-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Sparkles className="w-3 h-3" /> Select Shared Image Pathway
                                     </label>
                                     <select
                                        onChange={(e) => {
                                            if(e.target.value) setFormData(prev => ({...prev, image_url: e.target.value}))
                                        }}
                                        className="w-full bg-white/[0.03] border border-pink-500/20 focus:border-pink-500/50 h-12 rounded-xl text-pink-100 text-xs px-4 appearance-none hover:bg-white/[0.06] transition-colors cursor-pointer"
                                     >
                                         <option value="" className="bg-[#111118]">-- Or choose a local image --</option>
                                         {availableImages.map(img => (
                                             <option key={img} value={img} className="bg-[#111118]">{img}</option>
                                         ))}
                                     </select>
                                 </div>
                             )}

                             <div className="space-y-2 pt-4 mt-4 border-t border-white/5">
                                 <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Upload className="w-3 h-3" /> Upload Live File
                                 </label>
                                 <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    disabled={isUploadingImage}
                                    className="w-full bg-white/[0.03] border border-purple-500/20 focus:border-purple-500/50 h-12 rounded-xl text-purple-100 text-xs px-2 py-2 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-purple-500/10 file:text-purple-400 hover:file:bg-purple-500/20 disabled:opacity-50 cursor-pointer"
                                 />
                                 {isUploadingImage && <p className="text-[10px] text-purple-400 animate-pulse font-bold ml-1">Uploading asset to server...</p>}
                             </div>
                        </div>
                    </section>

                    <section className="glass-card rounded-[2.5rem] p-8 border border-white/[0.05] space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Settings className="w-5 h-5 text-gray-400" />
                            <h2 className="text-sm font-black text-white uppercase tracking-widest">Deployment & Details</h2>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">External Live Link</label>
                                <div className="relative">
                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <Input
                                        value={formData.link}
                                        onChange={handleChange('link')}
                                        placeholder="https://..."
                                        className="bg-white/[0.03] border-white/[0.08] h-12 rounded-xl pl-10 text-xs"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Client / Organization</label>
                                <Input
                                    value={formData.client}
                                    onChange={handleChange('client')}
                                    placeholder="Organization Name"
                                    className="bg-white/[0.03] border-white/[0.08] h-12 rounded-xl text-sm"
                                />
                            </div>
                        </div>
                    </section>
                </div>
            </form>
        </div>
    );
}
