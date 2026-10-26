import { MetadataRoute } from 'next';
import { onlyVisible, articlePath } from '@/lib/articles';
import { latestDate } from '@/lib/sitemap-dates';
import { SITE_URL } from '@/lib/site';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Rebuild hourly so new articles reach search engines without a deploy
export const revalidate = 3600;

type ArticleRow = { id: string; slug: string | null; published_at: string; updated_at: string | null };
type GalleryRow = { id: string; created_at: string; gallery_images: { uploaded_at: string | null }[] | null };

// lastmod is only set from real change dates; pages without one leave it out
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: articleData } = await onlyVisible(supabase.from('articles').select('id, slug, published_at, updated_at'))
    .order('published_at', { ascending: false });
  const articles = (articleData ?? []) as ArticleRow[];

  const articleUrls = articles.map((article) => ({
    url: `${SITE_URL}${articlePath(article)}`,
    lastModified: latestDate(article.published_at, article.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const { data: galleryData } = await supabase
    .from('galleries')
    .select('id, created_at, gallery_images(uploaded_at)')
    .order('created_at', { ascending: false });
  const galleries = (galleryData ?? []) as GalleryRow[];

  // A gallery changes when photos are added to it
  const galleryDates = galleries.map((g) => latestDate(g.created_at, ...(g.gallery_images ?? []).map((i) => i.uploaded_at)));
  const galleryUrls = galleries.map((gallery, i) => ({
    url: `${SITE_URL}/gallery/${gallery.id}`,
    lastModified: galleryDates[i],
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const newestArticle = latestDate(...articleUrls.map((a) => a.lastModified));
  const newestGallery = latestDate(...galleryDates);

  const staticRoutes = [
    { url: SITE_URL, lastModified: latestDate(newestArticle, newestGallery), changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${SITE_URL}/fixtures`, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${SITE_URL}/news`, lastModified: newestArticle, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${SITE_URL}/gallery`, lastModified: newestGallery, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${SITE_URL}/noteikumi`, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${SITE_URL}/privacy-policy`, changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${SITE_URL}/cookies-policy`, changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${SITE_URL}/team`, changeFrequency: 'monthly' as const, priority: 0.7 },
  ];

  return [...staticRoutes, ...articleUrls, ...galleryUrls];
}
