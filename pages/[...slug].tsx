import type { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import ListDetail from '../screens/ListDetail';
import VenueDetail from '../screens/VenueDetail';
import VenueListingPage from '../screens/VenueListingPage';
import {
  getAllVenueSlugs,
  getAllListSlugs,
  getVenueBySlug,
  getListBySlug,
  filterVenues,
  getUniqueCategories,
  getUniqueCities,
  getUniqueDistricts,
  getVenueById,
} from '../services/supabase-api';

interface VenueType {
  id: string;
  name: string;
  slug: string;
  location: string;
  category: string;
  rating: number;
  reviewCount: number;
  priceLevel: 1 | 2 | 3 | 4;
  images: string[];
  description: string;
  amenities: string[];
  coordinates: { lat: number; lng: number };
  reviews: any[];
}

interface ListType {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  coverImage: string;
  author: string;
  date: string;
  content: string;
  venueIds: string[];
}

interface ListingMeta {
  title: string;
  description: string;
  basePath: string;
  venues: VenueType[];
  image?: string;
}

type PageProps =
  | { kind: 'venue'; venue: VenueType }
  | { kind: 'list'; list: ListType; relatedVenues: VenueType[] }
  | { kind: 'listing'; listing: ListingMeta };

const buildListingDescription = (title: string) =>
  `${title}. Son eklenen mekanları keşfedin.`;

const buildListingMeta = (title: string, basePath: string, venues: VenueType[]): ListingMeta => {
  const sortedVenues = [...venues].reverse();
  const image = sortedVenues[0]?.images[0];

  return {
    title,
    description: buildListingDescription(title),
    basePath,
    venues: sortedVenues,
    ...(image ? { image } : {}),
  };
};

const SlugPage = (props: PageProps) => {
  if (props.kind === 'venue') {
    const venue = props.venue;
    const title = `${venue.name} | hangimekan.co`;
    const description = `${venue.name} - ${venue.category} • ${venue.location}. ${venue.description}`.slice(0, 160);
    const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://hangimekan.co'}/${venue.slug}`;
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: venue.name,
      image: venue.images,
      address: {
        '@type': 'PostalAddress',
        addressLocality: venue.location,
      },
      aggregateRating: venue.reviewCount > 0 ? {
        '@type': 'AggregateRating',
        ratingValue: venue.rating,
        reviewCount: venue.reviewCount,
      } : undefined,
    };

    return (
      <>
        <Head>
          <title>{title}</title>
          <meta name="description" content={description} />
          <link rel="canonical" href={url} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={url} />
          <meta property="og:image" content={venue.images[0]} />
          <meta name="theme-color" content="#FF385C" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:image" content={venue.images[0]} />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
        </Head>
        <VenueDetail venue={venue} />
      </>
    );
  }

  if (props.kind === 'list') {
    const { list, relatedVenues } = props;
    const title = `${list.title} | hangimekan.co`;
    const description = list.subtitle.slice(0, 160);
    const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://hangimekan.co'}/${list.slug}`;
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: list.title,
      description: list.subtitle,
      itemListElement: relatedVenues.map((venueItem, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://hangimekan.co'}/${venueItem.slug}`,
        name: venueItem.name,
      })),
    };

    return (
      <>
        <Head>
          <title>{title}</title>
          <meta name="description" content={description} />
          <link rel="canonical" href={url} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={url} />
          <meta property="og:image" content={list.coverImage} />
          <meta name="theme-color" content="#FF385C" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:image" content={list.coverImage} />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
        </Head>
        <ListDetail list={list} relatedVenues={relatedVenues} />
      </>
    );
  }

  return <VenueListingPage {...props.listing} />;
};

// Category name mapping
const CATEGORY_MAP: Record<string, string> = {
  'kahvalti': 'Kahvaltı',
  'kahve': 'Kahve',
  'aksam-yemegi': 'Akşam Yemeği',
  'gece-hayati': 'Gece Hayatı',
  'calisma': 'Çalışma',
  'manzara': 'Manzara',
};

const CATEGORY_SLUGS = Object.keys(CATEGORY_MAP);

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    // Fetch all slugs from Supabase
    const [venueSlugs, listSlugs, categories, cities, districts] = await Promise.all([
      getAllVenueSlugs(),
      getAllListSlugs(),
      getUniqueCategories(),
      getUniqueCities(),
      getUniqueDistricts(),
    ]);

    const paths: Array<{ params: { slug: string[] } }> = [];
    const seen = new Set<string>();

    const addPath = (segments: string[]) => {
      const key = segments.join('/');
      if (seen.has(key)) return;
      seen.add(key);
      paths.push({ params: { slug: segments } });
    };

    // Add venue paths
    venueSlugs.forEach((slug) => addPath([slug]));

    // Add list paths
    listSlugs.forEach((slug) => addPath([slug]));

    // Add category paths
    categories.forEach(({ slug }) => addPath([slug]));

    // Add city paths
    cities.forEach(({ slug }) => addPath([slug]));

    // Add city/district paths
    districts.forEach(({ citySlug, districtSlug }) => addPath([citySlug, districtSlug]));

    // Add city/category paths
    cities.forEach(({ slug: citySlug }) => {
      categories.forEach(({ slug: catSlug }) => {
        addPath([citySlug, catSlug]);
      });
    });

    // Add city/district/category paths
    districts.forEach(({ citySlug, districtSlug }) => {
      categories.forEach(({ slug: catSlug }) => {
        addPath([citySlug, districtSlug, catSlug]);
      });
    });

    return {
      paths,
      fallback: 'blocking', // Enable ISR for new pages
    };
  } catch (error) {
    console.error('Error in getStaticPaths:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const segments = Array.isArray(params?.slug)
    ? params?.slug
    : params?.slug
      ? [params?.slug]
      : [];

  if (segments.length === 0) {
    return { notFound: true };
  }

  try {
    if (segments.length === 1) {
      const slug = segments[0];

      // Check if it's a venue
      const venue = await getVenueBySlug(slug);
      if (venue) {
        return {
          props: {
            kind: 'venue',
            venue,
          },
          revalidate: 300, // 5 minutes
        };
      }

      // Check if it's a list
      const list = await getListBySlug(slug);
      if (list) {
        // Fetch related venues
        const relatedVenues: VenueType[] = [];
        for (const venueId of list.venueIds) {
          const v = await getVenueById(venueId);
          if (v) relatedVenues.push(v);
        }

        return {
          props: {
            kind: 'list',
            list,
            relatedVenues,
          },
          revalidate: 300,
        };
      }

      // Check if it's a category
      if (CATEGORY_SLUGS.includes(slug)) {
        const categoryName = CATEGORY_MAP[slug];
        const venues = await filterVenues({ categorySlug: slug });
        const title = `${categoryName} Mekanları`;
        return {
          props: {
            kind: 'listing',
            listing: buildListingMeta(title, `/${slug}`, venues),
          },
          revalidate: 300,
        };
      }

      // Check if it's a city
      const cities = await getUniqueCities();
      const city = cities.find((c) => c.slug === slug);
      if (city) {
        const venues = await filterVenues({ citySlug: slug });
        const title = `${city.name} Mekanları`;
        return {
          props: {
            kind: 'listing',
            listing: buildListingMeta(title, `/${slug}`, venues),
          },
          revalidate: 300,
        };
      }

      return { notFound: true };
    }

    if (segments.length === 2) {
      const [citySlug, secondSlug] = segments;

      const cities = await getUniqueCities();
      const city = cities.find((c) => c.slug === citySlug);

      if (!city) {
        return { notFound: true };
      }

      // Check if second slug is a category
      if (CATEGORY_SLUGS.includes(secondSlug)) {
        const categoryName = CATEGORY_MAP[secondSlug];
        const venues = await filterVenues({ citySlug, categorySlug: secondSlug });
        const title = `${city.name} ${categoryName} Mekanları`;
        return {
          props: {
            kind: 'listing',
            listing: buildListingMeta(title, `/${citySlug}/${secondSlug}`, venues),
          },
          revalidate: 300,
        };
      }

      // Check if second slug is a district
      const districts = await getUniqueDistricts();
      const district = districts.find(
        (d) => d.citySlug === citySlug && d.districtSlug === secondSlug
      );

      if (district) {
        const venues = await filterVenues({ citySlug, districtSlug: secondSlug });
        const title = `${district.districtName} Mekanları`;
        return {
          props: {
            kind: 'listing',
            listing: buildListingMeta(title, `/${citySlug}/${secondSlug}`, venues),
          },
          revalidate: 300,
        };
      }

      return { notFound: true };
    }

    if (segments.length === 3) {
      const [citySlug, districtSlug, categorySlug] = segments;

      const cities = await getUniqueCities();
      const city = cities.find((c) => c.slug === citySlug);

      const districts = await getUniqueDistricts();
      const district = districts.find(
        (d) => d.citySlug === citySlug && d.districtSlug === districtSlug
      );

      if (!city || !district || !CATEGORY_SLUGS.includes(categorySlug)) {
        return { notFound: true };
      }

      const categoryName = CATEGORY_MAP[categorySlug];
      const venues = await filterVenues({ citySlug, districtSlug, categorySlug });
      const title = `${district.districtName} ${categoryName} Mekanları`;

      return {
        props: {
          kind: 'listing',
          listing: buildListingMeta(title, `/${citySlug}/${districtSlug}/${categorySlug}`, venues),
        },
        revalidate: 300,
      };
    }

    return { notFound: true };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return { notFound: true };
  }
};

export default SlugPage;
