import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://netcy.fr'

  return [
    {
      url: baseUrl,
      lastModified: new Date('2026-04-01'),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/cgu`,
      lastModified: new Date('2026-01-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cgv`,
      lastModified: new Date('2026-01-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/politique-confidentialite`,
      lastModified: new Date('2026-01-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
