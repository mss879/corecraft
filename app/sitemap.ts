import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabaseClient'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.corecraft.agency'

  // Fetch all published blogs
  const { data: blogs, error } = await supabase
    .from('blogs')
    .select('slug, created_at')
    .eq('published', true)

  const blogUrls =
    !error
      ? blogs?.map((blog) => ({
          url: `${baseUrl}/blog/${blog.slug}`,
          lastModified: new Date(blog.created_at),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        })) ?? []
      : []

  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/start-career`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
  ]

  return [...routes, ...blogUrls]
}
