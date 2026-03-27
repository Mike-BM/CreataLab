import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Eye } from 'lucide-react';
import ProjectModal from './projectmodal.jsx';
import { Button } from '@/ui/button';

const categories = ["All", "Branding & Marketing Assets", "Digital", "Data", "AI Solutions"];

import { appConfig } from '@/lib/config';

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [hoveredProject, setHoveredProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${appConfig.api.base}/projects`);
        if (response.ok) {
          const data = await response.json();
          // Transform image_url to image for compatibility with ProjectModal
          const formattedData = data.map(p => ({
            ...p,
            image: p.image_url,
          }));
          setProjects(formattedData);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const handleFilterEvent = (event) => {
      const category = event.detail;
      if (typeof category !== 'string') return;
      if (!categories.includes(category)) return;
      setActiveFilter(category);
      const section = document.querySelector('#portfolio');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    };

    window.addEventListener('portfolioFilter', handleFilterEvent);
    return () => window.removeEventListener('portfolioFilter', handleFilterEvent);
  }, []);

  const filteredProjects = activeFilter === "All"
    ? projects
    : projects.filter(p => p.category === activeFilter);

  return (
    <section id="portfolio" className="py-32 bg-[#0a0a0f] relative">
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
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${activeFilter === category
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
            {isLoading ? (
              <div className="col-span-full py-20 text-center text-gray-500">Loading portfolio...</div>
            ) : filteredProjects.length === 0 ? (
              <div className="col-span-full py-24 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-white/[0.02] border border-white/5 rounded-full flex items-center justify-center mb-6 relative">
                  <div className="absolute inset-0 border border-purple-500/30 rounded-full animate-ping opacity-20"></div>
                  <div className="w-8 h-8 border-2 border-dashed border-purple-400/60 rounded-full animate-[spin_8s_linear_infinite]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Updating Soon</h3>
                <p className="text-gray-400 max-w-sm mx-auto leading-relaxed text-sm">
                  We are currently curating our latest {activeFilter !== 'All' ? <span className="text-purple-400 font-medium">{activeFilter}</span> : ''} projects. Check back shortly to see our fresh work!
                </p>
              </div>
            ) : (
              filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                  onClick={() => {
                    if (project.link) {
                      window.open(project.link, '_blank');
                    } else {
                      setSelectedProject(project);
                    }
                  }}
                  className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-white/20 transition-all duration-300 shadow-xl"
                >
                  {/* Image */}
                  <img
                    src={project.image_url}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="text-purple-400 text-sm font-medium mb-2">
                      {project.category}
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-col gap-3">
                      <Button
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProject(project);
                        }}
                        className="bg-white/10 backdrop-blur-md text-white border-white/10 hover:bg-white/20 h-10 px-4 rounded-xl text-xs font-bold w-fit"
                      >
                        <Eye className="w-3.5 h-3.5 mr-2" />
                        Explore Project
                      </Button>
                      {project.link && (
                        <div className="space-y-2">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(project.link, '_blank');
                            }}
                            className="premium-gradient text-white h-10 px-4 rounded-xl text-xs font-bold w-fit shadow-lg"
                          >
                            <ExternalLink className="w-3.5 h-3.5 mr-2" />
                            Visit Live Site
                          </Button>
                          <p className="text-[10px] text-gray-400 font-medium italic animate-pulse">
                            view the live site and maybe leave a feedback
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Border gradient on hover */}
                  <div className="absolute inset-0 rounded-2xl border border-white/0 group-hover:border-white/20 transition-colors duration-500" />
                </motion.div>
              )))}
          </AnimatePresence>
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="group inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/20 text-white hover:bg-white/5 transition-all duration-300">
            View All Projects
            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}