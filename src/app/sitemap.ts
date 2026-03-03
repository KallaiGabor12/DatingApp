import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

// Static pages configuration
const staticPages = [
  { path: '/', priority: 1.0, changeFrequency: 'weekly' as const },
  { path: '/rolunk', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/kapcsolat', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/gyik', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/referenciak', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/szolgaltatasok/hoszivattyu', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/szolgaltatasok/hutestechnika/ipari-gepek', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/szolgaltatasok/hutestechnika/lakossagi-klimaszereles', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/szolgaltatasok/hutestechnika/legtechnika', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/szolgaltatasok/javitas-karbantartas', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/szolgaltatasok/kereskedelmi-hutok', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/szolgaltatasok/vizsgalatok-dokumentacio', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/szolgaltatasok/VRV', priority: 0.7, changeFrequency: 'monthly' as const },
]

/**
 * Get the most recent timestamp from reference images (gallery)
 * This efficiently tracks when the references page content was last modified
 * 
 * Note: Testimonials (reviews) don't have timestamps in the schema, so we only
 * track gallery images. To track testimonials, add a timestamp field to the
 * Testimonial model and update this function to check both.
 */
async function getReferencesLastModified(): Promise<Date> {
  try {
    // Get the most recent gallery image timestamp
    // This is efficient - single query with index on timestamp
    const mostRecentImage = await prisma.referenceImage.findFirst({
      orderBy: { timestamp: 'desc' },
      select: { timestamp: true },
    })

    if (mostRecentImage?.timestamp) {
      // Convert Unix timestamp (seconds) to Date
      return new Date(mostRecentImage.timestamp * 1000)
    }

    // Fallback to current date if no images exist
    return new Date()
  } catch (error) {
    // If database query fails, return current date
    console.error('Error fetching references last modified:', error)
    return new Date()
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get base URL from environment or use default
  const baseUrl = 'https://cool-finish.hu'

  // Get dynamic lastModified for references page
  const referencesLastModified = await getReferencesLastModified()

  return staticPages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    // Only set lastModified for pages with dynamic content
    // Static pages don't need lastModified - search engines will use changeFrequency
    lastModified: page.path === '/referenciak' ? referencesLastModified : undefined,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }))
}

