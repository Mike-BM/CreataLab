import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  ExternalLink, 
  Tag, 
  Sparkles, 
  CheckCircle2, 
  Share2, 
  Check, 
  Layers, 
  Target, 
  TrendingUp, 
  Award 
} from 'lucide-react';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';
import Contact from '@/components/landing/contact';
import { Button } from '@/ui/button';
import { toast } from 'sonner';
import { appConfig } from '@/lib/config';

const fallbackProjects = [
  {
    id: 1,
    title: 'AI-Powered FinTech Analytics Dashboard',
    category: 'AI Solutions',
    client: 'Nexus Financial Group',
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',
    description: 'An autonomous financial intelligence platform that synthesizes real-time market data into actionable executive insights.',
    full_description: 'Nexus Financial required a complete architectural overhaul of their client analytics suite. We built an AI-native interface where portfolio managers can query billions of rows of market volatility data using natural language.',
    problem: 'Legacy reporting workflows took 3 business days to synthesize market data into client-facing PDFs, causing analysts to miss critical trading windows.',
    solution: 'We engineered an autonomous real-time data streaming pipeline using React 18, Vite, and custom Python LLM agents to generate charts and summaries instantaneously.',
    impact: 'Reduced reporting turnaround time by 98% and increased daily active analyst engagement by 340% within two weeks of deployment.',
    tools: ['React 18', 'Vite', 'Python LLM Workflows', 'OpenAI API', 'Tailwind CSS', 'Supabase'],
    features: [
      'Natural language SQL database queries',
      'Real-time generative financial charts',
      'Automated PDF & Excel report synthesis',
      'Role-based institutional encryption'
    ],
    link: 'https://creatalab.com',
    published: true,
  },
  {
    id: 2,
    title: 'Global E-Commerce & Luxury Brand Architecture',
    category: 'Digital',
    client: 'Aura Luxury Goods',
    image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80',
    description: 'An ultra-premium glassmorphism web platform and checkout experience engineered for sub-second international conversions.',
    full_description: 'Aura needed a digital flagship store that matched their bespoke craftsmanship. We replaced their slow monolithic architecture with a sleek, high-performance edge web application.',
    problem: 'High bounce rates (68%) on mobile devices and sluggish 4.2-second page load times were severing conversions during international checkout drops.',
    solution: 'Designed an immersive dark-mode UI with Framer Motion micro-interactions and migrated the entire infrastructure to serverless edge computing.',
    impact: 'Boosted global conversion rates from 1.4% to 4.8% and reduced average checkout completion time by 45% in the first 30 days post-launch.',
    tools: ['React', 'Framer Motion', 'Tailwind CSS', 'Vercel Edge', 'Stripe API'],
    features: [
      'Sub-second page transitions & caching',
      'Interactive visual product customization',
      'Localized multi-currency checkout',
      'Automated abandoned cart AI recovery'
    ],
    link: 'https://creatalab.com',
    published: true,
  }
];

export default function PortfolioDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const fetchProject = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${appConfig.api.base}/projects/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProject(data);
        } else {
          const found = fallbackProjects.find(p => String(p.id) === String(id));
          setProject(found || null);
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        const found = fallbackProjects.find(p => String(p.id) === String(id));
        setProject(found || null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Case study link copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#050508] text-white">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center gap-4 py-32">
          <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-sm text-white/50 font-mono tracking-widest uppercase">Loading Case Study...</p>
        </main>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col bg-[#050508] text-white">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-32">
          <h2 className="text-3xl font-extrabold text-white mb-4">Case Study Not Found</h2>
          <p className="text-white/60 mb-8 max-w-md">
            We couldn&apos;t locate this specific portfolio project. It may have been archived or updated.
          </p>
          <Link to="/">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl px-6 py-3">
              ← Return to Portfolio
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#050508] text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-6 max-w-6xl mx-auto w-full">
        {/* Navigation & Share Bar */}
        <div className="flex items-center justify-between pb-8 border-b border-white/10 mb-10">
          <Link
            to="/#portfolio"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white group transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Work</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Link!' : 'Share Case Study'}</span>
            </button>

            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl text-xs px-4 py-2 flex items-center gap-1.5 shadow-lg shadow-purple-500/20">
                  <span>Visit Live Platform</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Header Hero */}
        <header className="space-y-6 mb-12">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-pink-400" />
              {project.category || 'Digital Innovation'}
            </span>
            {project.client && (
              <span className="text-xs font-semibold text-white/60 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                Client: {project.client}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight max-w-4xl">
            {project.title}
          </h1>

          <p className="text-lg md:text-xl text-white/70 max-w-3xl leading-relaxed">
            {project.description || project.full_description}
          </p>
        </header>

        {/* Featured Image Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-white/5 mb-16 shadow-2xl group">
          <img
            src={project.image_url || project.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80'}
            alt={project.title}
            className="w-full h-[400px] md:h-[550px] object-cover block group-hover:scale-[1.01] transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent opacity-60 pointer-events-none" />
        </div>

        {/* 2-Column Deep Dive Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          {/* Left 2 Cols: Challenge, Solution, Impact */}
          <div className="lg:col-span-2 space-y-12">
            {/* Challenge */}
            <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 backdrop-blur-md space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-pink-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-3 text-pink-400 font-extrabold text-sm uppercase tracking-wider">
                <Target className="w-5 h-5" />
                <span>01. The Challenge</span>
              </div>
              <p className="text-base md:text-lg text-white/80 leading-relaxed">
                {project.problem || 'Our client required a comprehensive modernization of their legacy systems to eliminate bottlenecks and accelerate user engagement.'}
              </p>
            </div>

            {/* Solution */}
            <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 backdrop-blur-md space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-3 text-purple-400 font-extrabold text-sm uppercase tracking-wider">
                <Layers className="w-5 h-5" />
                <span>02. Strategic Architecture & Solution</span>
              </div>
              <p className="text-base md:text-lg text-white/80 leading-relaxed">
                {project.solution || 'We architected a bespoke, high-performance web platform utilizing modern UI frameworks, real-time edge databases, and intuitive UX flows.'}
              </p>
            </div>

            {/* Impact */}
            <div className="bg-gradient-to-br from-purple-900/20 via-pink-900/10 to-transparent border border-purple-500/30 rounded-3xl p-8 backdrop-blur-md space-y-4 relative overflow-hidden shadow-xl">
              <div className="flex items-center gap-3 text-amber-400 font-extrabold text-sm uppercase tracking-wider">
                <TrendingUp className="w-5 h-5" />
                <span>03. Measurable Business Impact</span>
              </div>
              <p className="text-base md:text-lg text-white/90 font-medium leading-relaxed">
                {project.impact || 'Delivered significant improvements in conversion rates, operational speed, and overall client satisfaction.'}
              </p>
            </div>
          </div>

          {/* Right Col: Tech Stack & Features Checklist */}
          <div className="space-y-8">
            {/* Tech Stack Pills */}
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" />
                <span>Tech Stack & Tools</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {(project.tools && project.tools.length > 0 ? project.tools : ['React 18', 'Vite', 'Tailwind CSS', 'Supabase', 'Framer Motion']).map((tool, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/80 text-xs font-semibold"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Key Features */}
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span>Key Platform Features</span>
              </h3>
              <ul className="space-y-3">
                {(project.features && project.features.length > 0 ? project.features : [
                  'Sub-second page rendering',
                  'Interactive dark-mode UI',
                  'Automated client workflows',
                  'Enterprise-grade security'
                ]).map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs md:text-sm text-white/70">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Call To Action */}
        <div className="rounded-3xl bg-gradient-to-r from-purple-900/30 via-black to-pink-900/20 border border-purple-500/30 p-8 md:p-12 text-center space-y-6">
          <h3 className="text-2xl md:text-4xl font-extrabold text-white">
            Ready to Build a State-of-the-Art Platform?
          </h3>
          <p className="text-white/70 max-w-xl mx-auto text-sm md:text-base">
            Whether you need an autonomous AI product, a bespoke brand system, or a high-converting web application, CreataLab is ready to collaborate.
          </p>
          <div className="pt-2">
            <Link to="/#contact">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-purple-500/25">
                Schedule a Discovery Call
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Contact />
      <Footer />
    </div>
  );
}
