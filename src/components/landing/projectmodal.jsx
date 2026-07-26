import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Tag, Sparkles, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/ui/button';
import PropTypes from 'prop-types';

export default function ProjectModal({ project, isOpen, onClose }) {
  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-background rounded-3xl border border-border pointer-events-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image Container */}
              <div className="relative w-full bg-surface flex flex-col items-center justify-center rounded-t-3xl border-b border-border p-4">
                {project.link ? (
                  <div 
                    onClick={() => {
                      if (window.confirm("View the live site?")) {
                        window.open(project.link, '_blank');
                      }
                    }} 
                    className="block group cursor-pointer"
                  >
                    <img
                      src={project.image_url || 'https://placehold.co/800x600/1a1a2e/8b5cf6?text=No+Preview'}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/800x600/1a1a2e/8b5cf6?text=No+Preview';
                      }}
                      className="w-full h-auto block shadow-lg rounded-xl transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </div>
                ) : (
                  <img
                    src={project.image_url || 'https://placehold.co/800x600/1a1a2e/8b5cf6?text=No+Preview'}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/800x600/1a1a2e/8b5cf6?text=No+Preview';
                    }}
                    className="w-full h-auto block shadow-lg rounded-xl"
                  />
                )}
              </div>

              {/* Content */}
              <div className="p-8 md:p-12">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium">
                    {project.category}
                  </span>
                  {project.client && (
                    <span className="text-muted text-sm">Client: {project.client}</span>
                  )}
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  {project.title}
                </h2>



                {/* Enhanced Case Study Sections */}
                <div className="grid md:grid-cols-2 gap-10 mb-12">
                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-surface border border-border">
                      <h3 className="text-foreground font-bold text-lg mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-accent rounded-full" />
                        The Project
                      </h3>
                      <p className="text-muted text-sm leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    {project.problem && (
                      <div className="p-6 rounded-2xl bg-surface border border-border">
                        <h3 className="text-foreground font-bold text-lg mb-3 flex items-center gap-2">
                          <span className="w-1.5 h-6 bg-accent rounded-full" />
                          The Problem
                        </h3>
                        <p className="text-muted text-sm leading-relaxed">
                          {project.problem}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    {project.full_description && (
                      <div className="p-6 rounded-2xl bg-surface border border-border">
                        <h3 className="text-foreground font-bold text-lg mb-3 flex items-center gap-2">
                          <span className="w-1.5 h-6 bg-accent rounded-full" />
                          The Outcome
                        </h3>
                        <p className="text-muted text-sm leading-relaxed">
                          {project.full_description}
                        </p>
                      </div>
                    )}

                    {project.impact && (
                      <div className="p-6 rounded-2xl bg-accent/5 border border-accent/20 shadow-soft">
                        <h3 className="text-accent font-bold text-lg mb-3 flex items-center gap-2">
                          <Sparkles className="w-5 h-5" />
                          The Impact
                        </h3>
                        <p className="text-foreground text-sm leading-relaxed font-medium">
                          {project.impact}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tools Used */}
                {project.tools && project.tools.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-foreground font-semibold mb-4 flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Tools & Technologies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tools.map((tool) => (
                        <span
                          key={tool}
                          className="px-3 py-1.5 rounded-lg bg-surface border border-border text-foreground text-sm"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Features */}
                {project.features && project.features.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-foreground font-semibold mb-4">Key Features</h3>
                    <ul className="space-y-2">
                      {project.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3 text-muted">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA */}
                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border">
                  {project.link && (
                    <Button
                      onClick={() => window.open(project.link, '_blank')}
                      className="bg-accent hover:bg-accent-hover text-white rounded-full px-8 h-12 text-sm font-bold shadow-soft hover:shadow-md hover:-translate-y-1 transition-all flex items-center gap-2"
                    >
                      <span>View Live Project</span>
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                  <Link to={`/portfolio/${project.id}`} onClick={onClose}>
                    <Button
                      variant="outline"
                      className="rounded-full px-8 h-12 text-sm font-bold border-border text-foreground hover:bg-surface hover:-translate-y-1 transition-all flex items-center gap-2"
                    >
                      <span>Open Full Case Study</span>
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

ProjectModal.propTypes = {
  project: PropTypes.shape({
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    category: PropTypes.string,
    client: PropTypes.string,
    description: PropTypes.string,
    fullDescription: PropTypes.string,
    problem: PropTypes.string,
    solution: PropTypes.string,
    impact: PropTypes.string,
    tools: PropTypes.arrayOf(PropTypes.string),
    features: PropTypes.arrayOf(PropTypes.string),
    link: PropTypes.string,
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};