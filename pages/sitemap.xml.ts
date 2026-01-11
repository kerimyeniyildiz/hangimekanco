import type { GetServerSideProps } from 'next';
import {
  getAllVenueSlugs,
  getAllListSlugs,
  getUniqueCategories,
  getUniqueCities,
  getUniqueDistricts,
} from '../services/supabase-api';

const buildSitemap = async () => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hangimekan.co';
  const today = new Date().toISOString().split('T')[0];

  // Fetch data from Supabase
  const [venueSlugs, listSlugs, categories, cities, districts] = await Promise.all([
    getAllVenueSlugs(),
    getAllListSlugs(),
    getUniqueCategories(),
    getUniqueCities(),
    getUniqueDistricts(),
  ]);

  const staticPaths = ['/', '/lists', '/add-venue', '/help', '/arama'];
  const venuePaths = venueSlugs.map((slug) => `/${slug}`);
  const listPaths = listSlugs.map((slug) => `/${slug}`);
  const categoryPaths = categories.map(({ slug }) => `/${slug}`);
  const cityPaths = cities.map(({ slug }) => `/${slug}`);
  const cityDistrictPaths = districts.map(
    ({ citySlug, districtSlug }) => `/${citySlug}/${districtSlug}`,
  );
  const cityCategoryPaths = cities.flatMap(({ slug: citySlug }) =>
    categories.map(({ slug: catSlug }) => `/${citySlug}/${catSlug}`),
  );
  const districtCategoryPaths = districts.flatMap(({ citySlug, districtSlug }) =>
    categories.map(({ slug: catSlug }) => `/${citySlug}/${districtSlug}/${catSlug}`),
  );

  const urls = Array.from(
    new Set([
      ...staticPaths,
      ...venuePaths,
      ...listPaths,
      ...categoryPaths,
      ...cityPaths,
      ...cityDistrictPaths,
      ...cityCategoryPaths,
      ...districtCategoryPaths,
    ]),
  )
    .map((path) => {
      const priority = path === '/' ? '1.0' : path.includes('/') && path.split('/').length > 2 ? '0.6' : '0.8';
      const changefreq = path === '/' ? 'daily' : 'weekly';
      return `  <url>
    <loc>${siteUrl}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const sitemap = await buildSitemap();

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.write(sitemap);
    res.end();
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.statusCode = 500;
    res.end('Error generating sitemap');
  }

  return { props: {} };
};

const Sitemap = () => null;

export default Sitemap;
