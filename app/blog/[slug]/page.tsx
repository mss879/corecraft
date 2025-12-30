import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { SiteNav } from '@/components/layout/site-nav';
import { SiteFooter } from '@/components/layout/site-footer';
import { Metadata } from 'next';

export const dynamicParams = false;

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image_url: string;
  created_at: string;
  published: boolean;
  author: string;
}

export async function generateStaticParams() {
  const { data } = await supabase.from('blogs').select('slug').eq('published', true);
  return (data ?? [])
    .map((row) => row?.slug)
    .filter((slug): slug is string => typeof slug === 'string' && slug.length > 0)
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { data: blog } = await supabase.from('blogs').select('*').eq('slug', params.slug).single();
  if (!blog) return { title: 'Blog Not Found' };
  return {
    title: blog.title,
    description: blog.excerpt,
    openGraph: {
        images: [blog.image_url || '']
    }
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { data: blog } = await supabase.from('blogs').select('*').eq('slug', params.slug).single();

  if (!blog) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section with Image and Title */}
      <div className="relative h-[400px] w-full overflow-hidden md:h-[450px] lg:h-[500px]">
        {/* Background Image */}
        <Image
          src={blog.image_url || "https://framerusercontent.com/images/wUatyS07We1puzzPLO6XxWqf5Mk.jpg"}
          alt={blog.title}
          fill
          className="object-cover"
          priority
        />
        
        {/* Navigation */}
        <div className="relative z-50">
          <SiteNav logoHref="/" forceFloating={true} />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 z-30" />

        {/* Page Title - Overlaid on Image */}
        <div className="absolute inset-0 z-40 flex items-center justify-center pt-20 md:pt-0">
          <div className="mx-auto max-w-[1000px] px-4 md:px-8 w-full">
            <div className="space-y-6 text-center">
              <div className="flex items-center justify-center gap-3 text-sm font-medium uppercase tracking-wider text-white/80">
                <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                {blog.author && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-white/60" />
                    <span>{blog.author}</span>
                  </>
                )}
              </div>
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl" style={{ fontFamily: '"Stack Sans Notch", sans-serif' }}>
                {blog.title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <article className="mx-auto max-w-[800px] px-4 py-16 md:px-8 md:py-24">
        <div className="prose prose-lg prose-gray mx-auto">
           <div className="whitespace-pre-wrap font-sans text-lg leading-relaxed text-gray-800">
            {blog.content}
           </div>
        </div>
      </article>

      {/* Footer */}
      <SiteFooter logoHref="/" />
    </div>
  );
}
