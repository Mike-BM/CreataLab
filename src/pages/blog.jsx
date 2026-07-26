import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Sparkles, Calendar, User, ArrowRight, BookOpen, Tag, Flame } from 'lucide-react';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';
import Contact from '@/components/landing/contact';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { appConfig } from '@/lib/config';

const fallbackPosts = [
  {
    id: 1,
    slug: 'ai-native-agency-architecture',
    title: 'The AI-Native Agency Architecture: How We Embed LLMs into Web Products',
    excerpt: 'Discover how modern web applications move beyond simple chatbots to integrate autonomous AI workflows, semantic search, and real-time generative interfaces.',
    content: `# The AI-Native Agency Architecture\n\nIn 2026, building a website is no longer just about static pages and responsive layouts. The next paradigm is **AI-Native Web Applications**—platforms that reason, adapt, and personalize content in real-time.\n\n### Why Architecture Matters\nWhen integrating Large Language Models (LLMs) into production applications, latency and user experience are paramount. By leveraging edge functions, vector embeddings, and streaming responses, we achieve sub-second interactions.\n\n### Core Pillars of AI Integration:\n1. **Semantic Search & Retrieval**: Replacing rigid keyword searches with vector database lookups.\n2. **Generative UI Components**: Interfaces that render dynamic charts and cards based on user queries.\n3. **Automated Workflows**: Streamlining client onboarding and data analysis without human bottlenecks.\n\nAt CreataLab, we engineer these systems from the ground up, ensuring your digital presence is state-of-the-art.`,
    category: 'AI & Tech',
    author: 'Brian Muema',
    date: '2026-07-20',
    readTime: '4 min read',
    published: true,
  },
  {
    id: 2,
    slug: 'designing-for-emotional-impact',
    title: 'Designing for Emotional Impact: Why Glassmorphism & Dark Mode Win in Modern UI',
    excerpt: 'An exploration of visual storytelling, color psychology, and how curated dark-mode aesthetics elevate brand trust and user engagement in digital products.',
    content: `# Designing for Emotional Impact\n\nFirst impressions in digital products happen in under 50 milliseconds. When a user lands on your platform, they aren't just reading text; they are experiencing your brand's aesthetic energy.\n\n### The Power of Glassmorphism\nBy using subtle background blur, delicate borders, and glowing gradient accents, we create a sense of depth and hierarchy. It makes interfaces feel like physical, premium glass interfaces.\n\n### Key Principles We Apply:\n- **Curated Palette**: Avoiding harsh pure black (#000) or blinding white, opting instead for tailored obsidian and deep charcoal tones.\n- **Micro-Animations**: Providing tactile visual feedback on button hovers and card transitions.\n- **Typography Mastery**: Using bold, architectural typography to guide the reader's eye seamlessly.\n\nGreat design is not just how it looks—it is how it makes your client feel.`,
    category: 'Branding',
    author: 'CreataLab Creative Team',
    date: '2026-07-15',
    readTime: '3 min read',
    published: true,
  },
  {
    id: 3,
    slug: 'vite-react-vercel-performance',
    title: 'Vite, React 18, and Serverless: Building Sub-Second Loading Platforms',
    excerpt: 'How modern frontend tooling and edge serverless deployment combine to deliver lightning-fast page loads, superior SEO scores, and zero-downtime scalability.',
    content: `# Vite, React 18, and Serverless Performance\n\nPerformance is user experience. Every 100ms of latency costs conversions. In this technical breakdown, we explore our core engineering stack at CreataLab.\n\n### Why We Prioritize Speed\nSearch engines like Google heavily penalize slow Core Web Vitals. By transitioning to Vite and serverless API endpoints, our bundle sizes shrink and initial render speeds skyrocket.\n\n### Engineering Best Practices:\n- **Code Splitting & Lazy Loading**: Only loading the JavaScript chunks needed for the current viewport.\n- **Optimized Assets**: Next-generation WebP images and icon treeshaking.\n- **Edge Caching**: Delivering content from servers closest to the user's geographic location.\n\nWhen you partner with CreataLab, your software is built for ultimate speed and scale.`,
    category: 'Web Development',
    author: 'Brian Muema',
    date: '2026-07-10',
    readTime: '5 min read',
    published: true,
  }
];

const categories = ["All", "AI & Tech", "Web Development", "Branding", "Innovation"];

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${appConfig.api.base}/posts`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setPosts(data);
          } else {
            setPosts(fallbackPosts);
          }
        } else {
          setPosts(fallbackPosts);
        }
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setPosts(fallbackPosts);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesCategory = activeCategory === 'All' || 
        (post.category && post.category.toLowerCase() === activeCategory.toLowerCase());
      
      const query = searchQuery.toLowerCase();
      const matchesSearch = !query || 
        (post.title && post.title.toLowerCase().includes(query)) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(query)) ||
        (post.content && post.content.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [posts, activeCategory, searchQuery]);

  const featuredPost = useMemo(() => {
    return filteredPosts.length > 0 ? filteredPosts[0] : null;
  }, [filteredPosts]);

  const gridPosts = useMemo(() => {
    return filteredPosts.length > 1 ? filteredPosts.slice(1) : [];
  }, [filteredPosts]);

  return (
    <div className="min-h-screen flex flex-col bg-[#050508] text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-6 max-w-7xl mx-auto w-full">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium uppercase tracking-widest mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>CreataLab Insights</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 leading-tight"
          >
            Ideas, Architecture & <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">Innovation.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/70 leading-relaxed"
          >
            Explore our latest thoughts on AI systems, modern web engineering, brand identity, and high-performance digital aesthetics.
          </motion.p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12 bg-white/[0.02] border border-white/10 p-4 rounded-2xl backdrop-blur-md">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25 scale-105'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              type="text"
              placeholder="Search insights..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-black/40 border-white/10 rounded-xl text-sm text-white placeholder:text-white/40 focus:border-purple-500/50 focus:ring-purple-500/20 transition-all"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            <p className="text-sm text-white/50 uppercase tracking-widest font-mono">Loading articles...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          /* Empty State */
          <div className="py-24 text-center max-w-md mx-auto bg-white/[0.02] border border-white/5 rounded-3xl p-8">
            <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No Articles Found</h3>
            <p className="text-sm text-white/60 mb-6">
              We couldn&apos;t find any insights matching your search or filter criteria. Try adjusting your query.
            </p>
            <Button
              onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 rounded-xl"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Featured Post Card (1st Item) */}
            {featuredPost && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative rounded-3xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/15 hover:border-purple-500/40 p-6 md:p-10 transition-all duration-500 overflow-hidden shadow-2xl"
              >
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/20 transition-all duration-500" />
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="max-w-3xl space-y-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-amber-400" />
                        Featured • {featuredPost.category || 'Innovation'}
                      </span>
                      <span className="text-xs text-white/50 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {featuredPost.date}
                      </span>
                      {featuredPost.author && (
                        <span className="text-xs text-white/50 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" />
                          {featuredPost.author}
                        </span>
                      )}
                    </div>

                    <h2 className="text-2xl md:text-4xl font-extrabold text-white group-hover:text-purple-300 transition-colors duration-300 leading-snug">
                      {featuredPost.title}
                    </h2>

                    <p className="text-sm md:text-base text-white/70 line-clamp-3 leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                  </div>

                  <div className="flex-shrink-0">
                    <Link to={`/blog/${featuredPost.slug || featuredPost.id}`}>
                      <Button className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold px-6 py-6 rounded-2xl shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 group-hover:scale-105 transition-all duration-300">
                        <span>Read Article</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Grid of Remaining Posts */}
            {gridPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gridPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="group relative flex flex-col justify-between rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/25 hover:bg-white/[0.06] p-6 transition-all duration-300 overflow-hidden shadow-lg"
                  >
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between gap-2 text-xs text-white/50">
                        <span className="px-2.5 py-1 rounded-md bg-white/10 text-white/90 font-medium">
                          {post.category || 'Tech'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {post.date}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors duration-300 line-clamp-2 leading-snug">
                        {post.title}
                      </h3>

                      <p className="text-sm text-white/60 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
                      <span className="flex items-center gap-1.5 truncate max-w-[150px]">
                        <User className="w-3 h-3 text-purple-400" />
                        {post.author || 'CreataLab Team'}
                      </span>
                      <Link
                        to={`/blog/${post.slug || post.id}`}
                        className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-all"
                      >
                        <span>Read</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <Contact />
      <Footer />
    </div>
  );
}
