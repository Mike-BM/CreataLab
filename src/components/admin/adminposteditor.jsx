import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  FileText, 
  Calendar, 
  User, 
  Tag, 
  Sparkles,
  Rocket,
  Edit3,
  Search,
  Type,
  AlignLeft,
  Eye,
  Settings
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { appConfig } from '@/lib/config';
import { adminAuth } from '@/lib/admin-auth';

export default function AdminPostEditor({ mode = 'create' }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(mode === 'edit');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: 'Administrator',
    category: 'Innovation',
    date: new Date().toISOString().slice(0, 10),
    published: false,
    link: '',
  });

  useEffect(() => {
    if (mode === 'edit' && id) {
      const loadPost = async () => {
        try {
          const response = await fetch(`${appConfig.api.base}/posts/${id}`);
          if (!response.ok) throw new Error('Failed to load post');
          const data = await response.json();
          setFormData({
            title: data.title ?? '',
            slug: data.slug ?? '',
            excerpt: data.excerpt ?? '',
            content: data.content ?? '',
            author: data.author ?? 'Administrator',
            category: data.category ?? 'Innovation',
            date: data.date ? data.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
            published: Boolean(data.published),
            link: data.link ?? '',
          });
        } catch (error) {
          console.error('Error loading post:', error);
          toast.error('Failed to sync insight data');
        } finally {
          setIsLoading(false);
        }
      };
      loadPost();
    }
  }, [mode, id]);

  const handleChange = (field) => (e) => {
    const value = field === 'published' ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const endpoint = mode === 'edit' && id
          ? `${appConfig.api.base}/posts/${id}`
          : `${appConfig.api.base}/posts`;
      const method = mode === 'edit' && id ? 'PUT' : 'POST';

      const token = adminAuth.getToken();
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save post');

      toast.success(`Insight ${mode === 'edit' ? 'updated' : 'deployed'} to stream.`);
      navigate('/admin/posts');
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Content persistence failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-96 glass-card rounded-[2.5rem] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest animate-pulse">Retrieving Insight Source...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-24">
      {/* Tool Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="w-12 h-12 glass-card rounded-xl text-gray-400 hover:text-white transition-all flex items-center justify-center p-0"
            onClick={() => navigate('/admin/posts')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">
              {mode === 'edit' ? 'Refine' : 'Initialize'} <span className="text-gray-600">Insight</span>
            </h1>
            <p className="text-gray-400 font-medium tracking-tight">Crafting premium thought leadership content</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => setFormData(prev => ({ ...prev, published: !prev.published }))}
            className={`h-14 rounded-2xl px-6 font-bold text-xs uppercase tracking-widest transition-all gap-3 ${
                formData.published 
                  ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20' 
                  : 'bg-white/[0.03] text-gray-400 border border-white/[0.08]'
            }`}
          >
            {formData.published ? <Rocket className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border border-current" />}
            {formData.published ? 'Deployment Active' : 'Staging Mode'}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="premium-gradient text-white font-bold rounded-2xl px-10 h-14 shadow-lg hover:scale-105 transition-all"
          >
            <Save className="w-5 h-5 mr-3" />
            {isSubmitting ? 'Syncing...' : 'Save Draft'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-10">
        {/* Editor Backbone */}
        <div className="lg:col-span-8 space-y-8">
          <section className="glass-card rounded-[3rem] p-10 border border-white/[0.05] space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Core Identity</label>
              <Input
                value={formData.title}
                onChange={handleChange('title')}
                placeholder="The Architectural Impact of Agentic Systems"
                required
                className="bg-transparent border-none text-4xl md:text-5xl font-black text-white h-auto p-0 focus-visible:ring-0 placeholder:text-white/10 tracking-tighter"
              />
            </div>
            
            <div className="h-px bg-white/[0.05]" />

            <div className="space-y-4">
               <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2 flex items-center gap-2">
                 <AlignLeft className="w-3 h-3" /> Abstract (Excerpt)
               </label>
               <Textarea
                value={formData.excerpt}
                onChange={handleChange('excerpt')}
                placeholder="A concise synchronization of the core thesis presented in this entry..."
                required
                className="bg-white/[0.02] border-white/5 focus:border-purple-500/40 min-h-[100px] rounded-2xl text-lg font-medium text-gray-200 p-6 leading-relaxed"
              />
            </div>

            <div className="space-y-4">
               <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2 flex items-center gap-2">
                 <Edit3 className="w-3 h-3" /> Master Content Engine
               </label>
               <Textarea
                value={formData.content}
                onChange={handleChange('content')}
                placeholder="Begin the intellectual deep dive here using standard prose or structured markdown..."
                required
                className="bg-white/[0.02] border-white/5 focus:border-purple-500/40 min-h-[500px] rounded-[2rem] text-lg font-medium text-white/90 p-10 leading-relaxed scrollbar-hide"
              />
            </div>
          </section>
        </div>

        {/* Tactical Parameters */}
        <div className="lg:col-span-4 space-y-8">
          <section className="glass-card rounded-[2.5rem] p-8 border border-white/[0.05] space-y-8">
             <div className="flex items-center gap-3 pb-6 border-b border-white/[0.05]">
                <Settings className="w-5 h-5 text-gray-400" />
                <h2 className="text-sm font-black text-white uppercase tracking-widest">Metadata Config</h2>
             </div>

             <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                     <Type className="w-3 h-3" /> System Slug
                   </label>
                   <Input
                    value={formData.slug}
                    onChange={handleChange('slug')}
                    placeholder="architectural-impact-agentic"
                    required
                    className="bg-white/[0.03] border-white/[0.08] h-12 rounded-xl text-xs font-mono"
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                     <Tag className="w-3 h-3" /> Taxonomy (Category)
                   </label>
                   <Input
                    value={formData.category}
                    onChange={handleChange('category')}
                    placeholder="Innovation, Strategy, Tech..."
                    className="bg-white/[0.03] border-white/[0.08] h-12 rounded-xl text-sm font-bold"
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                     <User className="w-3 h-3" /> Intelligence Source
                   </label>
                   <Input
                    value={formData.author}
                    onChange={handleChange('author')}
                    placeholder="CreataLab Administrator"
                    className="bg-white/[0.03] border-white/[0.08] h-12 rounded-xl text-sm font-bold"
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                     <Calendar className="w-3 h-3" /> Insight Timestamp
                   </label>
                   <Input
                    type="date"
                    value={formData.date}
                    onChange={handleChange('date')}
                    className="bg-white/[0.03] border-white/[0.08] h-12 rounded-xl text-sm font-bold dark-calendar"
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                     <Eye className="w-3 h-3" /> External Reference (URL)
                   </label>
                   <Input
                    value={formData.link || ''}
                    onChange={handleChange('link')}
                    placeholder="https://visit-website.com"
                    className="bg-white/[0.03] border-white/[0.08] h-12 rounded-xl text-xs"
                   />
                </div>
             </div>
          </section>

          <section className="glass-card rounded-[2.5rem] p-8 border border-white/[0.05]">
             <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h2 className="text-sm font-black text-white uppercase tracking-widest">Live Preview</h2>
             </div>
             <div className="rounded-2xl bg-black/40 border border-white/5 p-6 aspect-square flex flex-col items-center justify-center text-center">
                <Eye className="w-12 h-12 text-gray-800 mb-4" />
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-loose">
                  Real-time synchronization<br/>active in background
                </p>
             </div>
             <Button variant="ghost" className="w-full mt-8 rounded-xl border border-white/5 text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-white transition-all">
                Launch External Preview
             </Button>
          </section>
        </div>
      </form>
    </div>
  );
}
