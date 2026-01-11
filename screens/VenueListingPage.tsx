import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import Seo from '../components/Seo';
import VenueListing from './VenueListing';
import { getPageFromQuery, paginate } from '../services/pagination';

interface VenueType {
  id: string;
  name: string;
  slug?: string;
  location: string;
  category: string;
  rating: number;
  reviewCount: number;
  priceLevel: 1 | 2 | 3 | 4;
  images: string[];
  description: string;
  amenities: string[];
  coordinates: { lat: number; lng: number };
}

interface VenueListingPageProps {
  title: string;
  description: string;
  basePath: string;
  venues: VenueType[];
  image?: string;
  noIndex?: boolean;
}

const PAGE_SIZE = 8;

const VenueListingPage: React.FC<VenueListingPageProps> = ({
  title,
  description,
  basePath,
  venues,
  image,
  noIndex,
}) => {
  const router = useRouter();
  const currentPage = useMemo(() => getPageFromQuery(router.query), [router.query]);
  const { items, page, totalPages } = useMemo(
    () => paginate(venues, currentPage, PAGE_SIZE),
    [venues, currentPage],
  );

  return (
    <>
      <Seo title={title} description={description} path={basePath} image={image} noIndex={noIndex} />
      <VenueListing
        title={title}
        description={description}
        venues={items}
        basePath={basePath}
        page={page}
        totalPages={totalPages}
      />
    </>
  );
};

export default VenueListingPage;
