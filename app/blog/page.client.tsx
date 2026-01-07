'use client';

import { useEffect, useState } from 'react';
import { SiteNav } from '@/components/layout/site-nav';
import { SiteFooter } from '@/components/layout/site-footer';
import Image from 'next/image';
import { ArrowUpRight, X } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShareButton } from '@/components/share-button';

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

export default function BlogPageClient() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching blogs:', error);
        } else {
          setBlogs(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBlogs();
  }, []);

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.corecraft.agency',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://www.corecraft.agency/blog',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="relative h-[300px] w-full overflow-hidden md:h-[350px] lg:h-[400px]">
        {/* Background Image */}
        <Image
          src="https://framerusercontent.com/images/wUatyS07We1puzzPLO6XxWqf5Mk.jpg"
          alt="CoreCraft Career Insights & Blog Header"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black" />

        {/* Navigation */}
        <div className="relative z-50">
          <SiteNav logoHref="/" forceFloating={true} />
        </div>

        {/* Page Title - Overlaid on Image */}
        <div className="absolute inset-0 z-40 flex items-center justify-center pt-20 md:pt-0">
          <div className="mx-auto max-w-[1200px] px-4 md:px-8">
            <div className="space-y-3 text-center">
              <h1
                className="text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl"
                style={{ fontFamily: '"Stack Sans Notch", sans-serif' }}
              >
                Career Insights & Blog
              </h1>
              <p className="mx-auto max-w-2xl text-base text-white/70 md:text-lg">
                Expert advice on resume writing, career growth strategies, and digital innovation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="mx-auto max-w-[1200px] px-4 pt-4 pb-16 md:px-8 md:pt-6 md:pb-24">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-[#ff502e]"></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="py-20 text-center text-white/50">
            <p>No articles found. Check back soon!</p>
          </div>
        ) : (
          /* Blogs Grid */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                onClick={() => setSelectedBlog(blog)}
                className="group block cursor-pointer"
              >
                <div className="overflow-hidden rounded-3xl bg-white shadow-[0_10px_30px_-15px_rgba(255,255,255,0.1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.2)] h-full flex flex-col">
                  {/* Image Section */}
                  <div className="relative h-[200px] w-full overflow-hidden">
                    <Image
                      src={blog.image_url || 'https://framerusercontent.com/images/wUatyS07We1puzzPLO6XxWqf5Mk.jpg'}
                      alt={blog.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Arrow Button */}
                    <div className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-black opacity-0 transition-all duration-300 group-hover:opacity-100 shadow-sm">
                      <ArrowUpRight className="h-5 w-5" />
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                      <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                      {blog.author && (
                        <>
                          <span className="h-0.5 w-0.5 rounded-full bg-gray-400" />
                          <span>{blog.author}</span>
                        </>
                      )}
                    </div>

                    <h3 className="mb-2 text-lg font-bold leading-tight text-black md:text-xl group-hover:text-[#ff502e] transition-colors">
                      {blog.title}
                    </h3>

                    <p className="mb-4 text-sm text-gray-600 line-clamp-3">{blog.excerpt}</p>

                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <span className="text-xs font-bold uppercase tracking-widest text-black group-hover:text-[#ff502e] transition-colors">
                        Read Article
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer cover spacer */}
        <div className="h-32" />
      </section>

      {/* Blog Modal */}
      <Dialog open={!!selectedBlog} onOpenChange={(open) => !open && setSelectedBlog(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-[#111111] border border-white/10 h-[90vh] flex flex-col text-white">
          <DialogClose className="absolute right-4 top-4 z-50 rounded-full bg-black/50 p-2 text-white hover:bg-[#ff502e] transition-colors">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>

          {selectedBlog && (
            <ScrollArea className="h-full w-full">
              <div className="relative w-full bg-black aspect-video">
                <Image
                  src={selectedBlog.image_url || 'https://framerusercontent.com/images/wUatyS07We1puzzPLO6XxWqf5Mk.jpg'}
                  alt={selectedBlog.title}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="p-6 md:p-10">
                <div className="mb-8 space-y-4">
                  <div className="flex items-center gap-3 text-sm font-medium uppercase tracking-wider text-white/50">
                    <span>{new Date(selectedBlog.created_at).toLocaleDateString()}</span>
                    {selectedBlog.author && (
                      <>
                        <span className="h-1 w-1 rounded-full bg-white/30" />
                        <span>{selectedBlog.author}</span>
                      </>
                    )}
                  </div>
                  <h2
                    className="text-3xl font-bold leading-tight md:text-4xl lg:text-5xl text-white"
                    style={{ fontFamily: '"Stack Sans Notch", sans-serif' }}
                  >
                    {selectedBlog.title}
                  </h2>
                  <div>
                    <ShareButton
                      title={selectedBlog.title}
                      text={selectedBlog.excerpt}
                      path={`/blog/${selectedBlog.slug}`}
                      className="border-white/15 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                    />
                  </div>
                </div>

                <div className="prose prose-lg prose-invert mx-auto max-w-none">
                  <div
                    className="font-sans text-lg leading-relaxed text-white/80 [&>p]:mb-6 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mb-4 [&>h2]:mt-8 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:mb-3 [&>h3]:mt-6 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>blockquote]:border-l-4 [&>blockquote]:border-[#ff502e] [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-6"
                    dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
                  />
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <SiteFooter logoHref="/" />
    </div>
  );
}
