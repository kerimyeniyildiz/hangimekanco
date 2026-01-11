import React from 'react';
import Link from './AppLink';
import Image from 'next/image';
import { Star, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface VenueCardVenue {
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

interface VenueCardProps {
  venue: VenueCardVenue;
}

const VenueCard: React.FC<VenueCardProps> = ({ venue }) => {
  const { isFavorite, toggleFavorite, isAuthenticated } = useAuth();

  // Use slug if available, otherwise fallback to id
  const venueSlug = venue.slug || venue.id;

  const isSaved = isFavorite(venue.id);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }

    await toggleFavorite(venue.id);
  };

  // Default image if none available
  const imageUrl = venue.images[0] || 'https://picsum.photos/seed/default-venue/800/600';

  return (
    <div className="group flex flex-col gap-2 relative">
      {/* Image Slider / Static Image */}
      <Link to={`/${venueSlug}`} className="relative aspect-square rounded-xl overflow-hidden bg-gray-200">
        <Image
          src={imageUrl}
          alt={venue.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <button
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 text-white transition p-1 hover:scale-110 active:scale-90 z-10"
          aria-label={isSaved ? 'Favorilerden kaldır' : 'Favorilere ekle'}
        >
          <Heart
            className={`transition-colors duration-300 ${isSaved ? 'fill-primary stroke-primary' : 'fill-black/40 stroke-white'}`}
            size={24}
          />
        </button>
        {venue.rating >= 4.5 && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold shadow-sm">
            Misafirlerin favorisi
          </div>
        )}
      </Link>

      {/* Info */}
      <Link to={`/${venueSlug}`} className="flex justify-between items-start mt-1">
        <div>
          <h3 className="font-semibold text-gray-900 group-hover:underline">{venue.name}</h3>
          <p className="text-gray-500 text-sm">{venue.location}</p>
          <p className="text-gray-500 text-sm mt-0.5">{venue.category}</p>
          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="font-semibold text-gray-900">₺{venue.priceLevel === 1 ? '100-300' : venue.priceLevel === 2 ? '300-600' : '600+'}</span>
            <span className="text-gray-500 text-sm">kişi başı</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <Star size={14} className="fill-black" />
          <span>{venue.rating.toFixed(1)}</span>
        </div>
      </Link>
    </div>
  );
};

export default VenueCard;
