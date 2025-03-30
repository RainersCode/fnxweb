import { Article, Fixture } from '@/types/supabase';

/**
 * Generates JSON-LD structured data for a news article
 */
export function generateArticleSchema(article: Article, url: string) {
  const articleData = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: stripHtml(article.content).substring(0, 160),
    image: article.image_url || '/placeholder.svg',
    datePublished: article.published_at,
    dateModified: article.updated_at || article.published_at,
    author: article.author
      ? {
          '@type': 'Person',
          name: article.author,
        }
      : {
          '@type': 'Organization',
          name: 'RK Fēnikss',
          url: 'https://feniks-rugby.com',
        },
    publisher: {
      '@type': 'Organization',
      name: 'RK Fēnikss',
      url: 'https://feniks-rugby.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://feniks-rugby.com/Logo/fēniks_logo-removebg-preview.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  return articleData;
}

/**
 * Generates JSON-LD structured data for a sporting event (fixture)
 */
export function generateFixtureSchema(fixture: Fixture, url: string) {
  const fixtureData = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: `${fixture.home_team} vs ${fixture.away_team}`,
    startDate: fixture.match_date,
    location: {
      '@type': 'Place',
      name: fixture.location || 'Rugby Field',
      address: fixture.location_details || 'Valmiera, Latvia',
    },
    homeTeam: {
      '@type': 'SportsTeam',
      name: fixture.home_team,
    },
    awayTeam: {
      '@type': 'SportsTeam',
      name: fixture.away_team,
    },
    organizer: {
      '@type': 'Organization',
      name: 'RK Fēnikss',
      url: 'https://feniks-rugby.com',
    },
    url: url,
  };

  return fixtureData;
}

/**
 * Generates JSON-LD structured data for the sports organization
 */
export function generateOrganizationSchema() {
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'SportsOrganization',
    name: 'RK Fēnikss',
    url: 'https://feniks-rugby.com',
    logo: 'https://feniks-rugby.com/Logo/fēniks_logo-removebg-preview.png',
    foundingDate: '2005',
    location: {
      '@type': 'Place',
      name: 'Valmiera',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Valmiera',
        addressRegion: 'Vidzeme',
        addressCountry: 'Latvia',
      },
    },
    sameAs: [
      'https://www.facebook.com/rkfenikss/',
      // Add other social profiles here
    ],
    sport: 'Rugby',
    description: 'RK "Fēnikss" ir Valmieras vadošais regbija klubs, dibināts 2005. gadā.',
  };

  return organizationData;
}

/**
 * Helper function to strip HTML tags
 */
function stripHtml(html: string): string {
  if (typeof window !== 'undefined') {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }
  // Server-side fallback
  return html.replace(/<[^>]*>?/gm, '');
} 