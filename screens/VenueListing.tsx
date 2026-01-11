import React from 'react';
import { Search } from 'lucide-react';
import Link from '../components/AppLink';
import VenueCard from '../components/VenueCard';

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

interface VenueListingProps {
  title: string;
  description?: string;
  venues: VenueType[];
  basePath: string;
  page: number;
  totalPages: number;
}

const VenueListing: React.FC<VenueListingProps> = ({
  title,
  description,
  venues,
  basePath,
  page,
  totalPages,
}) => {
  const prevPage = page > 1 ? `${basePath}?sayfa=${page - 1}` : null;
  const nextPage = page < totalPages ? `${basePath}?sayfa=${page + 1}` : null;

  return (
    <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <header className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Son Eklenen</p>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">{title}</h1>
        {description && <p className="text-gray-600 mt-3 max-w-2xl">{description}</p>}
      </header>

      {venues.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={32} className="opacity-50" />
          </div>
          <h3 className="text-xl font-medium text-gray-900">Sonuç bulunamadı</h3>
          <p className="mt-2">Arama kriterlerinizi genişletmeyi deneyin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-between">
          <Link
            to={prevPage ?? '#'}
            className={`px-4 py-2 rounded-full border border-gray-200 text-sm font-semibold ${prevPage ? 'hover:bg-gray-50' : 'opacity-40 pointer-events-none'
              }`}
          >
            Önceki
          </Link>
          <span className="text-sm text-gray-500">{page} / {totalPages}</span>
          <Link
            to={nextPage ?? '#'}
            className={`px-4 py-2 rounded-full border border-gray-200 text-sm font-semibold ${nextPage ? 'hover:bg-gray-50' : 'opacity-40 pointer-events-none'
              }`}
          >
            Sonraki
          </Link>
        </div>
      )}
    </div>
  );
};

export default VenueListing;
