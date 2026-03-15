import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  X, 
  Filter, 
  FolderOpen, 
  Image as ImageIcon,
  MoreVertical,
  ExternalLink,
  Layers,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { Button } from './UI/button';
import { Input } from './UI/input';
import { toast } from 'sonner';
import { appConfig } from '@/Lib/config';
import { adminAuth } from '@/Lib/admin-auth';

export default function AdminPortfolio() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${appConfig.api.base}/projects`);
            if (response.ok) {
                const data = await response.json();
                setProjects(data);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
            toast.error('Failed to sync with repository');
        } finally {
            setIsLoading(false);
        }
    };

    const categories = ['All', ...new Set(projects.map(p => p.category))];

    const filteredProjects = projects.filter((project) => {
        const matchesSearch =
            project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = filterCategory === 'All' || project.category === filterCategory;

        return matchesSearch && matchesCategory;
    });

    const handleDelete = async (id) => {
        if (window.confirm('Confirm permanent deletion of this asset?')) {
            try {
                const token = adminAuth.getToken();
                const response = await fetch(`${appConfig.api.base}/projects/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    setProjects(projects.filter((p) => p.id !== id));
                    toast.success('Asset removed from repository');
                } else {
                    toast.error('Deletion protocol failed');
                }
            } catch (error) {
                toast.error('Connection error');
            }
        }
    };

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                   <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl premium-gradient flex items-center justify-center text-white shadow-lg">
                            <Layers className="w-5 h-5" />
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tight underline-offset-8">PORTFOLIO <span className="text-gray-600">DECK</span></h1>
                    </div>
                    <p className="text-gray-400 font-medium">Managing creative assets and project records</p>
                </div>
                <Button
                    onClick={() => navigate('/admin/portfolio/new')}
                    className="premium-gradient hover:scale-105 active:scale-95 text-white font-bold rounded-2xl px-8 h-14 shadow-lg transition-all"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    New Project
                </Button>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="w-full lg:flex-1 relative group">
                    <Search className="w-4 h-4 text-gray-500 absolute left-5 top-1/2 -translate-y-1/2 group-focus-within:text-purple-400 transition-colors" />
                    <input
                        placeholder="Filter projects by title, category, or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-14 pl-14 pr-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] focus:border-purple-500/50 text-white outline-none transition-all focus:ring-4 focus:ring-purple-500/10 font-medium md:text-sm"
                    />
                </div>
                <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 custom-scrollbar">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilterCategory(cat)}
                            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all border ${
                                filterCategory === cat 
                                  ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20' 
                                  : 'bg-white/[0.03] border-white/[0.08] text-gray-500 hover:text-white hover:bg-white/[0.06]'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Grid */}
            {isLoading ? (
                <div className="h-96 glass-card rounded-[2.5rem] flex flex-col items-center justify-center gap-4">
                  <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest animate-pulse">Retrieving Asset Records...</p>
                </div>
            ) : (
                <AnimatePresence mode="popLayout">
                    {filteredProjects.length > 0 ? (
                        <motion.div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {filteredProjects.map((project, i) => (
                                <motion.div
                                    key={project.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="glass-card rounded-[2rem] border border-white/[0.05] overflow-hidden group hover:border-purple-500/30 transition-all"
                                >
                                    {/* Thumbnail Area */}
                                    <div className="aspect-[16/10] relative overflow-hidden bg-[#050508]">
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent opacity-60 z-10" />
                                        {project.image_url ? (
                                            <img 
                                                src={project.image_url} 
                                                alt={project.title} 
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ImageIcon className="w-10 h-10 text-gray-800" />
                                            </div>
                                        )}
                                        
                                        {/* Badges */}
                                        <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
                                            <span className="px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-black text-white uppercase tracking-widest">
                                                {project.category}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded-md flex items-center gap-1.5 text-[8px] font-black uppercase tracking-tighter ${
                                                project.published ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gray-500/20 text-gray-400 border border-white/10'
                                            }`}>
                                                {project.published ? <CheckCircle2 className="w-2.5 h-2.5" /> : <Circle className="w-2.5 h-2.5" />}
                                                {project.published ? 'Live' : 'Draft'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className="p-8 relative">
                                        <h3 className="text-xl font-black text-white mb-2 tracking-tight group-hover:text-purple-400 transition-colors uppercase">
                                            {project.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 font-medium line-clamp-2 mb-6 h-10">
                                            {project.description}
                                        </p>

                                        <div className="flex items-center justify-between pt-6 border-t border-white/[0.03]">
                                            <div className="flex items-center gap-1">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon"
                                                    onClick={() => navigate(`/admin/portfolio/edit/${project.id}`)}
                                                    className="w-10 h-10 rounded-xl bg-white/[0.03] text-gray-400 hover:text-white hover:bg-purple-500/20"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon"
                                                    onClick={() => handleDelete(project.id)}
                                                    className="w-10 h-10 rounded-xl bg-white/[0.03] text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            <Button 
                                                variant="ghost"
                                                onClick={() => window.open(`/project/${project.id}`, '_blank')}
                                                className="text-[10px] font-black text-purple-400 uppercase tracking-widest hover:text-white transition-colors"
                                            >
                                                View Live <ExternalLink className="w-3 h-3 ml-2" />
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="h-96 glass-card rounded-[2.5rem] flex flex-col items-center justify-center text-center p-12">
                            <div className="w-20 h-20 rounded-full bg-white/[0.03] flex items-center justify-center mb-6">
                                <FolderOpen className="w-10 h-10 text-gray-700" />
                            </div>
                            <h3 className="text-xl font-black text-white mb-2">No Assets Found</h3>
                            <p className="text-gray-500 max-w-xs font-medium text-sm mb-8">
                                Your repository is currently empty or no results match your query.
                            </p>
                            <Button
                                onClick={() => navigate('/admin/portfolio/new')}
                                className="premium-gradient text-white font-bold rounded-2xl px-10 h-14"
                            >
                                Initiate First Entry
                            </Button>
                        </div>
                    )}
                </AnimatePresence>
            )}
        </div>
    );
}
