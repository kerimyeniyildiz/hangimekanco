import React, { useState, useMemo, useEffect } from 'react';
import { Coffee, Utensils, Moon, Sun, Laptop, MapPin, Grid, XCircle, Search, Loader2 } from 'lucide-react';
import VenueCard from '../components/VenueCard';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import type { Venue as DBVenue } from '../lib/database.types';

type Category = 'Tümü' | 'Kahvaltı' | 'Kahve' | 'Akşam Yemeği' | 'Gece Hayatı' | 'Manzara' | 'Çalışma';

const CATEGORIES: { name: Category; icon: React.ReactNode }[] = [
  { name: 'Tümü', icon: <Grid size={24} /> },
  { name: 'Kahvaltı', icon: <Sun size={24} /> },
  { name: 'Kahve', icon: <Coffee size={24} /> },
  { name: 'Akşam Yemeği', icon: <Utensils size={24} /> },
  { name: 'Gece Hayatı', icon: <Moon size={24} /> },
  { name: 'Manzara', icon: <MapPin size={24} /> },
  { name: 'Çalışma', icon: <Laptop size={24} /> },
];

// Transform DB venue to app format
const transformVenue = (dbVenue: DBVenue) => ({
  id: dbVenue.id,
  name: dbVenue.name,
  slug: dbVenue.slug,
  location: dbVenue.location,
  category: dbVenue.category,
  rating: Number(dbVenue.rating) || 0,
  reviewCount: dbVenue.review_count || 0,
  priceLevel: dbVenue.price_level as 1 | 2 | 3 | 4,
  images: dbVenue.images || [],
  description: dbVenue.description || '',
  amenities: dbVenue.amenities || [],
  coordinates: dbVenue.coordinates || { lat: 41.0082, lng: 28.9784 },
  reviews: [],
});

interface HomeProps {
  initialVenues?: ReturnType<typeof transformVenue>[];
}

const Home: React.FC<HomeProps> = ({ initialVenues = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('Tümü');
  const [venues, setVenues] = useState(initialVenues);
  const [loading, setLoading] = useState(initialVenues.length === 0);
  const router = useRouter();

  const searchQuery = useMemo(() => {
    if (!router.isReady) return '';
    const queryValue = typeof router.query.q === 'string' ? router.query.q : '';
    return queryValue.toLowerCase();
  }, [router.isReady, router.query.q]);

  // Fetch venues from Supabase
  useEffect(() => {
    const fetchVenues = async () => {
      setLoading(true);

      let query = supabase.from('venues').select('*');

      // Apply category filter
      if (selectedCategory !== 'Tümü') {
        if (selectedCategory === 'Manzara') {
          query = query.contains('amenities', ['Boğaz Manzarası']);
        } else {
          query = query.eq('category', selectedCategory);
        }
      }

      // Apply search filter
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query.order('rating', { ascending: false });

      if (!error && data) {
        setVenues(data.map(transformVenue));
      }

      setLoading(false);
    };

    fetchVenues();
  }, [selectedCategory, searchQuery]);

  const clearSearch = () => {
    router.push('/');
  };

  return (
    <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      {/* Categories Bar */}
      <div className="sticky top-20 bg-white z-30 pt-4 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 mb-6 border-b sm:border-none border-gray-100 flex items-center justify-between gap-4">
        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar pb-2 flex-grow">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`flex flex-col items-center gap-2 min-w-[64px] pb-2 border-b-2 transition-all group ${selectedCategory === cat.name
                  ? 'border-black text-black opacity-100'
                  : 'border-transparent text-gray-500 opacity-60 hover:opacity-100 hover:bg-gray-50 rounded-lg sm:rounded-none sm:hover:bg-transparent'
                }`}
            >
              <div className={`transition-transform duration-200 ${selectedCategory === cat.name ? 'scale-110' : 'group-hover:scale-110'}`}>
                {cat.icon}
              </div>
              <span className="text-xs font-medium whitespace-nowrap">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search Result Indicator */}
      {searchQuery && (
        <div className="mb-6 flex items-center gap-2">
          <h2 className="text-lg font-semibold">"{searchQuery}" için sonuçlar</h2>
          <button onClick={clearSearch} className="text-gray-500 hover:text-black">
            <XCircle size={20} />
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      ) : (
        <>
          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {venues.map(venue => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>

          {venues.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="opacity-50" />
              </div>
              <h3 className="text-xl font-medium text-gray-900">Sonuç bulunamadı</h3>
              <p className="mt-2">Arama kriterlerinizi veya seçili kategoriyi değiştirmeyi deneyin.</p>
              {searchQuery && (
                <button onClick={clearSearch} className="mt-4 text-primary font-semibold hover:underline">
                  Aramayı temizle
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
