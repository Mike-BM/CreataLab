import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, FileText, Image, Briefcase, Tag } from 'lucide-react';
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
        tools: '', // We'll manage array via comma separated string for simplicity
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
                    toast.error('Failed to load project details.');
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

        // Convert comma separated strings back to arrays
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

            toast.success(`Project ${mode === 'edit' ? 'updated' : 'created'} successfully.`);
            navigate('/admin/portfolio');
        } catch (error) {
            console.error('Error saving project:', error);
            toast.error('Failed to save project.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        className="rounded-full border-white/10 text-gray-300 hover:text-white hover:bg-white/5"
                        onClick={() => navigate('/admin/portfolio')}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to portfolio
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-white">
                            {mode === 'edit' ? 'Edit Project' : 'Create New Project'}
                        </h1>
                    </div>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-gradient-to-br from-[#111118] to-[#0a0a0f] rounded-2xl border border-white/10 p-6 space-y-6"
            >
                {isLoading ? (
                    <div className="text-gray-400">Loading project...</div>
                ) : (
                    <>
                        {/* Basic Info */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-gray-300 text-sm mb-2 block flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-blue-400" />
                                    Title *
                                </label>
                                <Input
                                    value={formData.title}
                                    onChange={handleChange('title')}
                                    placeholder="e.g. TechFlow Rebrand"
                                    required
                                    className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="text-gray-300 text-sm mb-2 block flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-cyan-400" />
                                    Category
                                </label>
                                <Input
                                    value={formData.category}
                                    onChange={handleChange('category')}
                                    placeholder="e.g. Branding, Digital, Data..."
                                    className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                                />
                            </div>
                        </div>

                        {/* Media & Links */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-gray-300 text-sm mb-2 block flex items-center gap-2">
                                    <Image className="w-4 h-4 text-pink-400" />
                                    Image URL *
                                </label>
                                <Input
                                    value={formData.image_url}
                                    onChange={handleChange('image_url')}
                                    placeholder="https://... or /posters/my-poster.jpg"
                                    required
                                    className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                                />
                                <p className="text-xs text-gray-500 mt-1">Provide a full URL or a relative path to your public folder.</p>
                            </div>
                            <div>
                                <label className="text-gray-300 text-sm mb-2 block flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-purple-400" />
                                    Client
                                </label>
                                <Input
                                    value={formData.client}
                                    onChange={handleChange('client')}
                                    placeholder="e.g. ShopNow Inc."
                                    className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="text-gray-300 text-sm mb-2 block">Short Description *</label>
                            <Textarea
                                value={formData.description}
                                onChange={handleChange('description')}
                                placeholder="A quick summary for the grid..."
                                required
                                className="bg-white/5 border-white/10 text-white min-h-[80px] rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="text-gray-300 text-sm mb-2 block">Full Description</label>
                            <Textarea
                                value={formData.full_description}
                                onChange={handleChange('full_description')}
                                placeholder="Detailed description for the modal view..."
                                className="bg-white/5 border-white/10 text-white min-h-[120px] rounded-xl"
                            />
                        </div>

                        {/* Lists */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-gray-300 text-sm mb-2 block">Tools Used (comma separated)</label>
                                <Input
                                    value={formData.tools}
                                    onChange={handleChange('tools')}
                                    placeholder="Figma, React, Tailwind..."
                                    className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="text-gray-300 text-sm mb-2 block">Key Features (comma separated)</label>
                                <Input
                                    value={formData.features}
                                    onChange={handleChange('features')}
                                    placeholder="Logo Design, Style Guide..."
                                    className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                                />
                            </div>
                        </div>

                        {/* Case Study Details */}
                        <div className="space-y-4 pt-4 border-t border-white/10">
                            <h3 className="text-white font-semibold">Case Study Details</h3>
                            <div>
                                <label className="text-gray-300 text-sm mb-2 block">The Problem</label>
                                <Textarea
                                    value={formData.problem}
                                    onChange={handleChange('problem')}
                                    placeholder="What challenge did the client face?"
                                    className="bg-white/5 border-white/10 text-white min-h-[80px] rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="text-gray-300 text-sm mb-2 block">The Solution</label>
                                <Textarea
                                    value={formData.solution}
                                    onChange={handleChange('solution')}
                                    placeholder="How did you solve it?"
                                    className="bg-white/5 border-white/10 text-white min-h-[80px] rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="text-gray-300 text-sm mb-2 block">The Impact</label>
                                <Textarea
                                    value={formData.impact}
                                    onChange={handleChange('impact')}
                                    placeholder="What were the results?"
                                    className="bg-white/5 border-white/10 text-white min-h-[80px] rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="text-gray-300 text-sm mb-2 block">External Link (optional)</label>
                                <Input
                                    value={formData.link}
                                    onChange={handleChange('link')}
                                    placeholder="https://..."
                                    className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/10">
                            <label className="flex items-center gap-2 text-sm text-gray-300">
                                <input
                                    type="checkbox"
                                    checked={formData.published}
                                    onChange={handleChange('published')}
                                    className="w-4 h-4 rounded border-white/20"
                                />
                                Mark as published
                            </label>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-6"
                            >
                                <Save className="w-4 h-4" />
                                {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Create Project'}
                            </Button>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
}
