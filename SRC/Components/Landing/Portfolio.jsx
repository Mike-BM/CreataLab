import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Eye, RefreshCw } from 'lucide-react';
import ProjectModal from './ProjectModal';
import { appConfig } from '@/Lib/config';

const categories = ["All", "Branding", "Digital", "Data", "Web"];
const CACHE_KEY = 'creatalab_projects_cache';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Skeleton card for loading state
function SkeletonCard() {
  return (
    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/5 bg-white/[0.03]">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skeleton-shimmer" />
      <div className="absolute bottom-0 left-0 right-0 p-5 space-y-2">
        <div className="h-3 w-1/3 rounded-full bg-white/10" />
        <div className="h-5 w-2/3 rounded-full bg-white/10" />
        <div className="h-3 w-full rounded-full bg-white/5" />
      </div>
    </div>
  );
}

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [hoveredProject, setHoveredProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const fetchProjects = useCallback(async (showLoadingSpinner = true) => {
    if (showLoadingSpinner) setIsLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout

    try {
      const response = await fetch(`${appConfig.api.base}/projects`, {
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      const formatted = data.map(p => ({ ...p, image: p.image_url }));

      // Cache successful results
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: formatted, ts: Date.now() }));
      } catch (_) { /* ignore quota errors */ }

      setProjects(formatted);
    } catch (err) {
      clearTimeout(timeout);
      if (err.name !== 'AbortError') {
        console.error('Portfolio fetch error:', err);
        setError('Failed to load projects.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Try to load from cache first for instant display
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, ts } = JSON.parse(cached);
        if (Date.now() - ts < CACHE_TTL) {
          setProjects(data);
          setIsLoading(false);
          // Silently refresh in background (stale-while-revalidate)
          fetchProjects(false);
          return;
        }
      }
    } catch (_) { /* ignore */ }

    fetchProjects(true);
  }, [fetchProjects]);

  useEffect(() => {
    const handleFilterEvent = (event) => {
      const category = event.detail;
      if (typeof category !== 'string' || !categories.includes(category)) return;
      setActiveFilter(category);
      document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' });
    };
    window.addEventListener('portfolioFilter', handleFilterEvent);
    return () => window.removeEventListener('portfolioFilter', handleFilterEvent);
  }, []);

  const filteredProjects = activeFilter === "All"
    ? projects
    : projects.filter(p => p.category === activeFilter);

  return (
    <section id="portfolio" className="py-32 bg-[#0a0a0f] relative">

      {/* Add shimmer keyframe via inline style */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .skeleton-shimmer {
          animation: shimmer 1.8s ease-in-out infinite;
        }
      `}</style>

      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <span className="text-pink-400 text-sm font-medium tracking-wider uppercase mb-4 block">
            Our Work
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Featured
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"> Projects</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A showcase of our creative solutions across branding, design, data, and web development.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === category
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">

            {/* Skeleton Loading */}
            {isLoading && (
              <>
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <motion.div
                    key={`skeleton-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <SkeletonCard />
                  </motion.div>
                ))}
              </>
            )}

            {/* Error state */}
            {!isLoading && error && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 flex flex-col items-center gap-4"
              >
                <p className="text-gray-500 text-center">{error}</p>
                <button
                  onClick={() => fetchProjects(true)}
                  className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all text-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </button>
              </motion.div>
            )}

            {/* Empty state */}
            {!isLoading && !error && filteredProjects.length === 0 && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center text-gray-500"
              >
                No projects found. Check back soon!
              </motion.div>
            )}

            {/* Project Cards */}
            {!isLoading && filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
                onClick={() => setSelectedProject(project)}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-white/20 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]"
              >
                {/* Image with blur-up loading */}
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={e => {
                    e.target.style.display = 'none';
                  }}
                />

                {/* Always-visible subtle gradient at bottom for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Category chip always visible */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-purple-400 text-xs font-medium border border-purple-500/30">
                    {project.category}
                  </span>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                {/* Hover content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <h3 className="text-xl font-bold text-white mb-1">{project.title}</h3>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex gap-3">
                    <button
                      onClick={e => { e.stopPropagation(); setSelectedProject(project); }}
                      className="w-10 h-10 rounded-full bg-purple-600/80 backdrop-blur-sm flex items-center justify-center hover:bg-purple-500 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                    >
                      <Eye className="w-4 h-4 text-white" />
                    </button>
                    {project.link && (
                      <button
                        onClick={e => { e.stopPropagation(); window.open(project.link, '_blank'); }}
                        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 text-white" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View All Button */}
        {!isLoading && !error && filteredProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <button className="group inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/20 text-white hover:bg-white/5 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all duration-300">
              View All Projects
              <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
