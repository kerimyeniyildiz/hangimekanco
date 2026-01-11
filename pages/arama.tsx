import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import VenueListingPage from '../screens/VenueListingPage';
import { supabase } from '../lib/supabase';
import { slugify } from '../services/slug';
import { Loader2 } from 'lucide-react';

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

const SearchPage: React.FC = () => {
  const router = useRouter();
  const [venues, setVenues] = useState<VenueType[]>([]);
  const [loading, setLoading] = useState(true);

  const queryState = useMemo(() => {
    const q = typeof router.query.q === 'string' ? router.query.q.trim() : '';
    const city = typeof router.query.sehir === 'string' ? router.query.sehir.trim() : '';
    const district = typeof router.query.semt === 'string' ? router.query.semt.trim() : '';
    const category = typeof router.query.kategori === 'string' ? router.query.kategori.trim() : '';

    return {
      q,
      citySlug: city ? slugify(city) : undefined,
      districtSlug: district ? slugify(district) : undefined,
      categorySlug: category ? slugify(category) : undefined,
    };
  }, [router.query]);

  useEffect(() => {
    const fetchVenues = async () => {
      setLoading(true);

      let query = supabase.from('venues').select('*');

      // Apply filters
      if (queryState.q) {
        query = query.or(`name.ilike.%${queryState.q}%,location.ilike.%${queryState.q}%,description.ilike.%${queryState.q}%`);
      }

      if (queryState.categorySlug) {
        const categoryMap: Record<string, string> = {
          'kahvalti': 'Kahvaltı',
          'kahve': 'Kahve',
          'aksam-yemegi': 'Akşam Yemeği',
          'gece-hayati': 'Gece Hayatı',
          'calisma': 'Çalışma',
        };
        const categoryName = categoryMap[queryState.categorySlug];
        if (categoryName) {
          query = query.eq('category', categoryName);
        }
      }

      const { data, error } = await query.order('rating', { ascending: false });

      if (!error && data) {
        const transformed = data.map((v: any) => ({
          id: v.id,
          name: v.name,
          slug: v.slug,
          location: v.location,
          category: v.category,
          rating: Number(v.rating) || 0,
          reviewCount: v.review_count || 0,
          priceLevel: v.price_level as 1 | 2 | 3 | 4,
          images: v.images || [],
          description: v.description || '',
          amenities: v.amenities || [],
          coordinates: v.coordinates || { lat: 41.0082, lng: 28.9784 },
        }));
        setVenues(transformed);
      }

      setLoading(false);
    };

    if (router.isReady) {
      fetchVenues();
    }
  }, [router.isReady, queryState]);

  const title = queryState.q
    ? `"${queryState.q}" için arama sonuçları`
    : 'Arama Sonuçları';
  const description = 'Filtrelerinize uygun mekanları listeleyin.';

  if (loading) {
    return (
      <div className="pt-24 pb-12 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <VenueListingPage
      title={title}
      description={description}
      basePath="/arama"
      venues={venues}
      noIndex={false}
    />
  );
};

export default SearchPage;
