import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Search, X, Filter, FolderOpen, Image } from 'lucide-react';
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
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setIsLoading(true);
        try {
            // Use the admin endpoint to fetch ALL projects including drafts
            const token = adminAuth.getToken();
            const response = await fetch(`${appConfig.api.base}/admin/projects`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Cache-Control': 'no-store',
                },
            });
            if (response.ok) {
                const data = await response.json();
                setProjects(data);
            } else {
                toast.error('Failed to load portfolio projects');
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
            toast.error('Failed to load portfolio projects');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredProjects = projects.filter((project) => {
        const matchesSearch =
            project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter =
            filterStatus === 'all' ||
            (filterStatus === 'published' && project.published) ||
            (filterStatus === 'draft' && !project.published);

        return matchesSearch && matchesFilter;
    });

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                const token = adminAuth.getToken();
                const response = await fetch(`${appConfig.api.base}/projects/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    setProjects(projects.filter((p) => p.id !== id));
                    toast.success('Project deleted successfully');
                } else {
                    toast.error('Failed to delete project');
                }
            } catch (error) {
                toast.error('Error deleting project');
            }
        }
    };

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600/30 to-cyan-600/30 flex items-center justify-center">
                            <FolderOpen className="w-5 h-5 text-blue-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-white">Portfolio Manager</h1>
                    </div>
                    <p className="text-gray-400">Manage your works, case studies, and posters</p>
                </div>
                <Button
                    onClick={() => navigate('/admin/portfolio/new')}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-full px-6 flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>New Project</span>
                </Button>
            </motion.div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative group">
                    <Search className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <Input
                        placeholder="Search projects by title or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-11 pr-10 h-12 rounded-full bg-white/5 border-white/10 text-white"
                    />
                </div>
                {/* Status filter tabs */}
                <div className="flex gap-2">
                    {[
                        { key: 'all', label: `All (${projects.length})` },
                        { key: 'published', label: `Published (${projects.filter(p => p.published).length})` },
                        { key: 'draft', label: `Drafts (${projects.filter(p => !p.published).length})` },
                    ].map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setFilterStatus(key)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                                filterStatus === key
                                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Projects Grid */}
            {isLoading ? (
                <div className="text-center py-12 text-gray-400">Loading projects...</div>
            ) : (
                <AnimatePresence mode="wait">
                    {filteredProjects.length > 0 ? (
                        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProjects.map((project) => (
                                <motion.div
                                    key={project.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="bg-gradient-to-br from-[#111118] to-[#0a0a0f] rounded-2xl border border-white/10 overflow-hidden group"
                                >
                                    <div className="aspect-video bg-gray-900 relative">
                                        {project.image_url ? (
                                            <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Image className="w-8 h-8 text-gray-600" />
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${project.published ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                                {project.published ? 'Published' : 'Draft'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <span className="text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2 block">{project.category}</span>
                                        <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>

                                        <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/10">
                                            <button
                                                onClick={() => navigate(`/admin/portfolio/edit/${project.id}`)}
                                                className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(project.id)}
                                                className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
                            <FolderOpen className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-white mb-1">No projects found</h3>
                            <p className="text-gray-400 mb-4">You haven't added any portfolio items yet.</p>
                        </div>
                    )}
                </AnimatePresence>
            )}
        </div>
    );
}
