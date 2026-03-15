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
  Rocket
} from 'lucide-react';
import { Button } from './UI/button';
import { Input } from './UI/input';
import { Textarea } from './UI/textarea';
import { toast } from 'sonner';
import { appConfig } from '@/Lib/config';
import { adminAuth } from '@/Lib/admin-auth';

export default function AdminProjectEditor({ mode = 'create' }) {
    const navigate = useNavigate();
    const { id } = useParams();

    const [isLoading, setIsLoading] = useState(mode === 'edit');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        image_url: '',
        description: '',
        full_description: '',
        client: '',
        tools: '',
        features: '',
        problem: '',
        solution: '',
        impact: '',
        link: '',
        published: false,
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
                        problem: data.problem ?? '',
                        solution: data.solution ?? '',
                        impact: data.impact ?? '',
                        link: data.link ?? '',
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
    }, [mode, id]);

    const handleChange = (field) => (e) => {
        const value = field === 'published' ? e.target.checked : e.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
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
                                <Input
                                    value={formData.category}
                                    onChange={handleChange('category')}
                                    placeholder="Branding, Web, Data..."
                                    className="bg-white/[0.03] border-white/[0.08] focus:border-purple-500/50 h-14 rounded-2xl text-white font-bold"
                                />
                            </div>
                        </div>

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
                    </section>

                    <section className="glass-card rounded-[2.5rem] p-8 md:p-10 border border-white/[0.05] space-y-8 border-l-4 border-l-purple-600/50">
                        <div className="flex items-center gap-3 pb-6 border-b border-white/[0.05]">
                            <Briefcase className="w-5 h-5 text-blue-400" />
                            <h2 className="text-sm font-black text-white uppercase tracking-widest">Case Study Analysis</h2>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">The Challenge</label>
                                <Textarea
                                    value={formData.problem}
                                    onChange={handleChange('problem')}
                                    placeholder="Define the structural bottlenecks or requirements..."
                                    className="bg-white/[0.02] border-white/5 focus:border-blue-500/40 min-h-[80px] rounded-xl text-white"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Solution Framework</label>
                                <Textarea
                                    value={formData.solution}
                                    onChange={handleChange('solution')}
                                    placeholder="Architectural approach and implementation strategy..."
                                    className="bg-white/[0.02] border-white/5 focus:border-green-500/40 min-h-[80px] rounded-xl text-white"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Key Results & KPIs</label>
                                <Textarea
                                    value={formData.impact}
                                    onChange={handleChange('impact')}
                                    placeholder="Outcome, metrics, and final achievements..."
                                    className="bg-white/[0.02] border-white/5 focus:border-pink-500/40 min-h-[80px] rounded-xl text-white"
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

                        <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Asset URL</label>
                             <Input
                                value={formData.image_url}
                                onChange={handleChange('image_url')}
                                placeholder="https://cdn.creatalab.com/..."
                                required
                                className="bg-white/[0.03] border-white/[0.08] focus:border-pink-500/50 h-12 rounded-xl text-xs"
                             />
                        </div>
                    </section>

                    <section className="glass-card rounded-[2.5rem] p-8 border border-white/[0.05] space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Settings className="w-5 h-5 text-gray-400" />
                            <h2 className="text-sm font-black text-white uppercase tracking-widest">Asset Parameters</h2>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Identity (Client)</label>
                                <Input
                                    value={formData.client}
                                    onChange={handleChange('client')}
                                    placeholder="Organization Name"
                                    className="bg-white/[0.03] border-white/[0.08] h-12 rounded-xl text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Tech Stack (comma sep)</label>
                                <Input
                                    value={formData.tools}
                                    onChange={handleChange('tools')}
                                    placeholder="React, Figma, Node..."
                                    className="bg-white/[0.03] border-white/[0.08] h-12 rounded-xl text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">External Link</label>
                                <div className="relative">
                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500" />
                                    <Input
                                        value={formData.link}
                                        onChange={handleChange('link')}
                                        placeholder="https://..."
                                        className="bg-white/[0.03] border-white/[0.08] h-12 rounded-xl pl-10 text-xs"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </form>
        </div>
    );
}
