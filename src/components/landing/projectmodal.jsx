import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Tag } from 'lucide-react';
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
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#111118] rounded-3xl border border-white/10 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image */}
              <div className="relative min-h-[300px] max-h-[60vh] w-full bg-black/40 flex items-center justify-center overflow-hidden rounded-t-3xl border-b border-white/5">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-contain p-4"
                />
              </div>

              {/* Content */}
              <div className="p-8 md:p-12">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-4 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-400 text-sm font-medium">
                    {project.category}
                  </span>
                  {project.client && (
                    <span className="text-gray-500 text-sm">Client: {project.client}</span>
                  )}
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  {project.title}
                </h2>

                {/* Problem → Solution → Impact */}
                <div className="grid md:grid-cols-3 gap-6 mb-10">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                    <h3 className="text-sm font-semibold text-purple-300 mb-2 uppercase tracking-wide">Problem</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {project.problem || "We first clarify the specific brand, data, or product challenge so every design decision is tied to a real business goal."}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                    <h3 className="text-sm font-semibold text-cyan-300 mb-2 uppercase tracking-wide">Solution</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {project.solution || "We design and build a tailored solution—whether it’s a dashboard, web platform, or visual identity—that fits the client’s context and team."}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                    <h3 className="text-sm font-semibold text-emerald-300 mb-2 uppercase tracking-wide">Impact</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {project.impact || "Together we measure what changed: time saved, engagement gained, or clarity created for stakeholders and users."}
                    </p>
                  </div>
                </div>

                <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8">
                  {project.fullDescription || project.description}
                </p>

                {/* Tools Used */}
                {project.tools && project.tools.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Tools & Technologies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tools.map((tool) => (
                        <span
                          key={tool}
                          className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-sm"
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
                    <h3 className="text-white font-semibold mb-4">Key Features</h3>
                    <ul className="space-y-2">
                      {project.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3 text-gray-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA */}
                {project.link && (
                  <Button
                    onClick={() => window.open(project.link, '_blank')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-full px-6"
                  >
                    View Live Project
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                )}
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