import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, ArrowRight } from 'lucide-react';
import ProjectModal from './projectmodal.jsx';
import { Button } from '@/ui/button';
import { toast } from 'sonner';

const categories = ["All", "Branding & Marketing Assets", "Digital", "Data", "AI Solutions"];

import { appConfig } from '@/lib/config';

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [hoveredProject, setHoveredProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    let timeoutId;
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${appConfig.api.base}/projects`, { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          // Transform image_url to image for compatibility with ProjectModal
          const formattedData = data.map(p => ({
            ...p,
            image: p.image_url,
          }));
          
          setProjects(prevProjects => {
            // Only alert if we've already loaded the initial list, and the new list is larger
            if (prevProjects.length > 0 && formattedData.length > prevProjects.length) {
              const diff = formattedData.length - prevProjects.length;
              toast.success(`Live Sync: ${diff} new portfolio asset${diff > 1 ? 's' : ''} just arrived!`, {
                icon: '🚀',
              });
            }
            return formattedData;
          });
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoading(false);
      }
      // Poll every 5 seconds to automatically sync data without refresh
      timeoutId = setTimeout(fetchProjects, 5000);
    };
    fetchProjects();

    return () => clearTimeout(timeoutId);
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
    <section id="portfolio" className="py-32 bg-background relative overflow-visible z-10">
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
          className="mb-16"
        >
          <span className="inline-block px-4 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent-hover text-xs font-bold uppercase tracking-widest mb-6">
            Our Work
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight tracking-tight">
            Proof of <span className="text-accent">Work</span>
          </h2>
          <p className="text-muted text-lg max-w-2xl font-normal leading-[1.7]">
            We don't just build things; we craft digital experiences that demand attention. Here are a few projects we lost sleep over.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex overflow-x-auto pb-4 sm:flex-wrap justify-start gap-4 mb-16 no-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`whitespace-nowrap px-6 py-2.5 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 ${activeFilter === category
                ? 'bg-accent text-white shadow-soft'
                : 'bg-surface text-muted hover:text-foreground border border-border'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-16">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <div className="col-span-full py-20 text-center font-bold text-muted font-grotesk tracking-widest uppercase">Fetching evidence...</div>
            ) : filteredProjects.length === 0 ? (
              <div className="col-span-full py-24 flex flex-col items-center justify-center text-center">
                <h3 className="text-2xl font-black font-grotesk text-foreground mb-3 tracking-tight">Under Construction</h3>
                <p className="text-muted max-w-sm mx-auto leading-relaxed text-sm">
                  We are currently curating our latest {activeFilter !== 'All' ? <span className="text-cyan font-bold">{activeFilter}</span> : ''} projects. Check back shortly!
                </p>
              </div>
            ) : (
              filteredProjects.map((project, index) => {
                return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                  onClick={() => {
                    if (project.link) {
                      if (window.confirm("You are about to visit the live site. Do you want to continue?")) {
                        window.open(project.link, '_blank');
                      }
                    } else {
                      setSelectedProject(project);
                    }
                  }}
                  className={`group relative cursor-pointer flex flex-col col-span-1 aspect-[4/3] transform transition-transform duration-500 hover:-translate-y-1`}
                >
                  {/* Image Container */}
                  <div className="relative w-full h-full rounded-2xl overflow-hidden bg-surface mb-4 shadow-soft">
                    <img
                      src={project.image_url || 'https://placehold.co/800x600/1a1a2e/8b5cf6?text=No+Preview'}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/800x600/1a1a2e/8b5cf6?text=No+Preview';
                      }}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Dark overlay on hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                       <Button
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProject(project);
                          }}
                          className="rounded-full px-6 py-2 font-semibold hover:scale-105 transition-transform"
                        >
                          <Eye className="w-5 h-5 mr-2" />
                          Explore
                        </Button>
                    </div>
                  </div>

                  {/* Content below image */}
                  <div className="flex flex-col items-start px-2">
                    <span className="text-accent text-xs font-bold uppercase tracking-widest mb-1">
                      {project.category}
                    </span>
                    <h3 className="text-xl font-bold text-foreground leading-tight group-hover:text-accent-hover transition-colors">
                      {project.title}
                    </h3>
                  </div>
                </motion.div>
              )}))}
          </AnimatePresence>
        </motion.div>

        {/* View All & CTA Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 flex flex-col sm:flex-row items-center gap-6"
        >
          <button 
            onClick={() => {
              const section = document.querySelector('#contact');
              if (section) section.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-accent text-white font-bold rounded-full px-8 py-4 shadow-soft hover:shadow-md hover:bg-accent-hover transition-all"
          >
            Start Your Project
          </button>
          <button className="px-8 py-4 font-bold rounded-full bg-surface border border-border text-foreground hover:bg-muted flex items-center gap-2 group transition-all">
            View All Projects
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}