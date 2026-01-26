import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.fnx-rugby.lv';

  // Get all articles
  const { data: articles } = await supabase
    .from('articles')
    .select('id, published_at')
    .order('published_at', { ascending: false });

  // Generate article URLs
  const articleUrls = articles?.map((article) => ({
    url: `${baseUrl}/news/${article.id}`,
    lastModified: new Date(article.published_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) || [];

  // Get all galleries
  const { data: galleries } = await supabase
    .from('galleries')
    .select('id, created_at')
    .order('created_at', { ascending: false });

  // Generate gallery URLs
  const galleryUrls = galleries?.map((gallery) => ({
    url: `${baseUrl}/gallery/${gallery.id}`,
    lastModified: new Date(gallery.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  })) || [];

  // Static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/team`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/fixtures`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ];

  // Combine all routes
  return [...staticRoutes, ...articleUrls, ...galleryUrls];
} 