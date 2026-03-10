import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, FileText, Calendar, User, Tag } from 'lucide-react';
import { Button } from './UI/button';
import { Input } from './UI/input';
import { Textarea } from './UI/textarea';
import { toast } from 'sonner';
import { appConfig } from '@/lib/config';
import { adminAuth } from '@/lib/admin-auth';

export default function AdminPostEditor({ mode = 'create' }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(mode === 'edit');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: '',
    category: '',
    date: new Date().toISOString().slice(0, 10),
    published: false,
  });

  useEffect(() => {
    if (mode === 'edit' && id) {
      const loadPost = async () => {
        try {
          if (!appConfig.api.postsBase) {
            console.warn('No posts API base configured. Skipping post load.');
            setIsLoading(false);
            return;
          }

          const response = await fetch(`${appConfig.api.postsBase}/posts/${id}`);
          if (!response.ok) throw new Error('Failed to load post');
          const data = await response.json();
          setFormData({
            title: data.title ?? '',
            slug: data.slug ?? '',
            excerpt: data.excerpt ?? '',
            content: data.content ?? '',
            author: data.author ?? '',
            category: data.category ?? '',
            date: data.date ? data.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
            published: Boolean(data.published),
          });
        } catch (error) {
          console.error('Error loading post:', error);
          toast.error('Failed to load post details. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };

      loadPost();
    }
  }, [mode, id]);

  const handleChange = (field) => (e) => {
    const value = field === 'published' ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const endpoint =
        mode === 'edit' && id && appConfig.api.postsBase
          ? `${appConfig.api.postsBase}/posts/${id}`
          : appConfig.api.postsBase
            ? `${appConfig.api.postsBase}/posts`
            : '';
      const method = mode === 'edit' && id ? 'PUT' : 'POST';
      if (!endpoint) {
        console.warn('No posts API base configured. Running in demo mode.');
      } else {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const token = adminAuth.getToken();
        const response = await fetch(endpoint, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) throw new Error('Failed to save post');
      }

      toast.success(`Post ${mode === 'edit' ? 'updated' : 'created'} successfully.`);
      navigate('/admin/posts');
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Failed to save post. Check your API/database connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-full border-white/10 text-gray-300 hover:text-white hover:bg-white/5"
            onClick={() => navigate('/admin/posts')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to posts
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {mode === 'edit' ? 'Edit Post' : 'Create New Post'}
            </h1>
            <p className="text-sm text-gray-400">
              Connects to your API at {appConfig.api.postsBase}/posts
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-[#111118] to-[#0a0a0f] rounded-2xl border border-white/10 p-6 space-y-6"
      >
        {isLoading ? (
          <div className="text-gray-400">Loading post...</div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-300 text-sm mb-2 block flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-400" />
                  Title *
                </label>
                <Input
                  value={formData.title}
                  onChange={handleChange('title')}
                  placeholder="Amazing blog post title"
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-12 rounded-xl"
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm mb-2 block flex items-center gap-2">
                  <Tag className="w-4 h-4 text-pink-400" />
                  Slug *
                </label>
                <Input
                  value={formData.slug}
                  onChange={handleChange('slug')}
                  placeholder="amazing-blog-post-title"
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-12 rounded-xl"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-gray-300 text-sm mb-2 block flex items-center gap-2">
                  <User className="w-4 h-4 text-cyan-400" />
                  Author
                </label>
                <Input
                  value={formData.author}
                  onChange={handleChange('author')}
                  placeholder="CreataLab Team"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-12 rounded-xl"
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm mb-2 block flex items-center gap-2">
                  <Tag className="w-4 h-4 text-green-400" />
                  Category
                </label>
                <Input
                  value={formData.category}
                  onChange={handleChange('category')}
                  placeholder="Design, Data & Analytics..."
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-12 rounded-xl"
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm mb-2 block flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  Publish Date
                </label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={handleChange('date')}
                  className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="text-gray-300 text-sm mb-2 block">Excerpt *</label>
              <Textarea
                value={formData.excerpt}
                onChange={handleChange('excerpt')}
                placeholder="Short description shown in blog lists..."
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 min-h-[80px] rounded-xl resize-none"
              />
            </div>

            <div>
              <label className="text-gray-300 text-sm mb-2 block">Content *</label>
              <Textarea
                value={formData.content}
                onChange={handleChange('content')}
                placeholder="Full blog content (you can later switch this to a rich text editor)..."
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 min-h-[220px] rounded-xl"
              />
            </div>

            <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/10">
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={handleChange('published')}
                  className="w-4 h-4 rounded border-white/20 bg-white/5"
                />
                Mark as published
              </label>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6"
              >
                <Save className="w-4 h-4" />
                {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Create Post'}
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

