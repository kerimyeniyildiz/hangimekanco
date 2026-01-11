import React, { useEffect } from 'react';
import Image from 'next/image';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import VenueCard from '../components/VenueCard';
import Link from '../components/AppLink';

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

interface ListDetailProps {
  list: ListType;
  relatedVenues: VenueType[];
}

const ListDetail: React.FC<ListDetailProps> = ({ list, relatedVenues }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [list.id]);

  return (
    <article className="pt-24 pb-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <Link to="/lists" className="inline-flex items-center gap-2 text-gray-500 hover:text-black mb-8 transition">
        <ArrowLeft size={20} />
        <span>Tüm Listeler</span>
      </Link>

      <header className="mb-10 text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">{list.title}</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">{list.subtitle}</p>

        <div className="flex items-center justify-center gap-6 text-sm text-gray-500 border-y border-gray-100 py-4 max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <User size={16} />
            <span>{list.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>{list.date}</span>
          </div>
        </div>
      </header>

      {list.coverImage && (
        <div className="aspect-video w-full rounded-2xl overflow-hidden mb-12 shadow-lg relative">
          <Image
            src={list.coverImage}
            alt={list.title}
            fill
            sizes="(min-width: 1024px) 800px, 100vw"
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="prose prose-lg prose-slate mx-auto mb-16">
        <p>{list.content}</p>
      </div>

      {relatedVenues.length > 0 && (
        <div className="border-t border-gray-200 pt-12">
          <h3 className="text-2xl font-bold mb-8">Listelenen Mekanlar</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {relatedVenues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
};

export default ListDetail;
