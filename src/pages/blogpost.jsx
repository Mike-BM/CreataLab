import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Clock, 
  Share2, 
  Check, 
  Sparkles, 
  Bookmark, 
  Twitter, 
  Linkedin, 
  MessageCircle,
  ArrowUpRight
} from 'lucide-react';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';
import Contact from '@/components/landing/contact';
import { Button } from '@/ui/button';
import { toast } from 'sonner';
import { appConfig } from '@/lib/config';

const fallbackPosts = [
  {
    id: 1,
    slug: 'ai-native-agency-architecture',
    title: 'The AI-Native Agency Architecture: How We Embed LLMs into Web Products',
    excerpt: 'Discover how modern web applications move beyond simple chatbots to integrate autonomous AI workflows, semantic search, and real-time generative interfaces.',
    content: `# The AI-Native Agency Architecture\n\nIn 2026, building a website is no longer just about static pages and responsive layouts. The next paradigm is **AI-Native Web Applications**—platforms that reason, adapt, and personalize content in real-time.\n\n### Why Architecture Matters\nWhen integrating Large Language Models (LLMs) into production applications, latency and user experience are paramount. By leveraging edge functions, vector embeddings, and streaming responses, we achieve sub-second interactions.\n\n### Core Pillars of AI Integration:\n1. **Semantic Search & Retrieval**: Replacing rigid keyword searches with vector database lookups.\n2. **Generative UI Components**: Interfaces that render dynamic charts and cards based on user queries.\n3. **Automated Workflows**: Streamlining client onboarding and data analysis without human bottlenecks.\n\n> "The future of agency work isn't just delivering code or Figma files—it's delivering autonomous intelligence embedded within beautiful design."\n\n### Building for Real-Time Adaptivity\nAt CreataLab, we engineer these systems from the ground up using React 18, Vite, and serverless edge APIs, ensuring your digital presence is state-of-the-art and built to scale into the next decade.`,
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
    content: `# Designing for Emotional Impact\n\nFirst impressions in digital products happen in under 50 milliseconds. When a user lands on your platform, they aren't just reading text; they are experiencing your brand's aesthetic energy.\n\n### The Power of Glassmorphism\nBy using subtle background blur, delicate borders, and glowing gradient accents, we create a sense of depth and hierarchy. It makes interfaces feel like physical, premium glass interfaces.\n\n### Key Principles We Apply:\n- **Curated Palette**: Avoiding harsh pure black (#000) or blinding white, opting instead for tailored obsidian and deep charcoal tones.\n- **Micro-Animations**: Providing tactile visual feedback on button hovers and card transitions.\n- **Typography Mastery**: Using bold, architectural typography to guide the reader's eye seamlessly.\n\nGreat design is not just how it looks—it is how it makes your client feel and remember your brand.`,
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
    content: `# Vite, React 18, and Serverless Performance\n\nPerformance is user experience. Every 100ms of latency costs conversions. In this technical breakdown, we explore our core engineering stack at CreataLab.\n\n### Why We Prioritize Speed\nSearch engines like Google heavily penalize slow Core Web Vitals. By transitioning to Vite and serverless API endpoints, our bundle sizes shrink and initial render speeds skyrocket.\n\n### Engineering Best Practices:\n- **Code Splitting & Lazy Loading**: Only loading the JavaScript chunks needed for the current viewport.\n- **Optimized Assets**: Next-generation WebP images and icon treeshaking.\n- **Edge Caching**: Delivering content from servers closest to the user's geographic location.\n\nWhen you partner with CreataLab, your software is built for ultimate speed, resilience, and scale.`,
    category: 'Web Development',
    author: 'Brian Muema',
    date: '2026-07-10',
    readTime: '5 min read',
    published: true,
  }
];

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allPosts, setAllPosts] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${appConfig.api.base}/posts/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setPost(data);
        } else {
          const found = fallbackPosts.find(p => p.slug === slug || String(p.id) === String(slug));
          setPost(found || null);
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        const found = fallbackPosts.find(p => p.slug === slug || String(p.id) === String(slug));
        setPost(found || null);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchAll = async () => {
      try {
        const res = await fetch(`${appConfig.api.base}/posts`);
        if (res.ok) {
          const data = await res.json();
          setAllPosts(data && data.length > 0 ? data : fallbackPosts);
        } else {
          setAllPosts(fallbackPosts);
        }
      } catch {
        setAllPosts(fallbackPosts);
      }
    };

    fetchPost();
    fetchAll();
  }, [slug]);

  const relatedPosts = useMemo(() => {
    if (!post) return [];
    return allPosts
      .filter(p => (p.slug || String(p.id)) !== (post.slug || String(post.id)))
      .slice(0, 2);
  }, [allPosts, post]);

  const handleShareCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSocialShare = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post ? post.title : 'CreataLab Insights');
    let shareUrl = '';
    if (platform === 'twitter') shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
    if (platform === 'linkedin') shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    if (platform === 'whatsapp') shareUrl = `https://api.whatsapp.com/send?text=${title}%20${url}`;
    if (shareUrl) window.open(shareUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#050508] text-white">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center gap-4 py-32">
          <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-sm text-white/50 font-mono tracking-widest uppercase">Loading Article...</p>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-[#050508] text-white">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-32">
          <h2 className="text-3xl font-extrabold text-white mb-4">Article Not Found</h2>
          <p className="text-white/60 mb-8 max-w-md">
            The insight or article you are looking for may have been moved, renamed, or is currently unpublished.
          </p>
          <Link to="/blog">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl px-6 py-3">
              ← Return to All Insights
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

      <main className="flex-1 pt-28 pb-20 px-6 max-w-4xl mx-auto w-full">
        {/* Navigation & Share Header Bar */}
        <div className="flex items-center justify-between pb-8 border-b border-white/10 mb-10">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white group transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Insights</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSocialShare('twitter')}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              title="Share on Twitter"
            >
              <Twitter className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleSocialShare('linkedin')}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              title="Share on LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleSocialShare('whatsapp')}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              title="Share on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
            <button
              onClick={handleShareCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Article Metadata & Title */}
        <header className="space-y-6 mb-12">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
              {post.category || 'Innovation'}
            </span>
            <span className="text-xs text-white/50 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {post.date}
            </span>
            {post.readTime && (
              <span className="text-xs text-white/50 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 pt-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white shadow-md">
              {(post.author || 'C')[0]}
            </div>
            <div>
              <p className="text-sm font-bold text-white">{post.author || 'CreataLab Team'}</p>
              <p className="text-xs text-white/50">Innovation & Strategy</p>
            </div>
          </div>
        </header>

        {/* Article Content with Custom Markdown Styling */}
        <article className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 md:p-12 backdrop-blur-sm shadow-2xl mb-16">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-10 mb-4 tracking-tight" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-xl md:text-2xl font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-lg md:text-xl font-semibold text-purple-300 mt-6 mb-3" {...props} />,
              p: ({ node, ...props }) => <p className="text-base md:text-lg text-white/80 leading-relaxed mb-6" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-2 mb-6 text-white/80 text-base md:text-lg" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-2 mb-6 text-white/80 text-base md:text-lg" {...props} />,
              li: ({ node, ...props }) => <li className="text-white/80" {...props} />,
              blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-purple-500 pl-4 py-2 my-6 bg-purple-500/10 rounded-r-xl italic text-white/90" {...props} />,
              code: ({ node, inline, ...props }) => inline ? <code className="px-1.5 py-0.5 rounded bg-white/10 text-pink-300 font-mono text-sm" {...props} /> : <pre className="p-4 rounded-xl bg-black/60 border border-white/10 overflow-x-auto my-6 font-mono text-sm text-purple-200"><code {...props} /></pre>,
              strong: ({ node, ...props }) => <strong className="font-bold text-white" {...props} />,
            }}
          >
            {post.content}
          </ReactMarkdown>
        </article>

        {/* Related Insights Section */}
        {relatedPosts.length > 0 && (
          <section className="space-y-6 pt-8 border-t border-white/10">
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span>Related Insights</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map(rel => (
                <Link
                  key={rel.id}
                  to={`/blog/${rel.slug || rel.id}`}
                  className="group block rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/30 p-6 transition-all duration-300"
                >
                  <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2 block">
                    {rel.category || 'Innovation'}
                  </span>
                  <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors mb-2 line-clamp-2">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-white/60 line-clamp-2">
                    {rel.excerpt}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-white/70 group-hover:text-white transition-colors">
                    <span>Read article</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Contact />
      <Footer />
    </div>
  );
}
