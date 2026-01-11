import { createServerSupabaseClient } from '../lib/supabase';
import { slugify } from './slug';
import type { Venue, Review, CuratedList } from '../lib/database.types';

// Re-export types for compatibility
export type { Venue, Review, CuratedList };

// Transform DB venue to app format
const transformVenue = (dbVenue: Venue) => ({
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
    reviews: [] as Review[],
});

// Transform DB list to app format
const transformList = (dbList: CuratedList) => ({
    id: dbList.id,
    title: dbList.title,
    slug: dbList.slug,
    subtitle: dbList.subtitle || '',
    coverImage: dbList.cover_image || '',
    author: dbList.author || '',
    date: dbList.date || '',
    content: dbList.content || '',
    venueIds: dbList.venue_ids || [],
});

// ============ VENUE OPERATIONS ============

export async function getAllVenues() {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
        .from('venues')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching venues:', error);
        return [];
    }

    return (data || []).map(transformVenue);
}

export async function getVenueBySlug(slug: string) {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
        .from('venues')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !data) {
        return null;
    }

    return transformVenue(data);
}

export async function getVenueById(id: string) {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
        .from('venues')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) {
        return null;
    }

    return transformVenue(data);
}

export async function getVenuesByCategory(category: string) {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
        .from('venues')
        .select('*')
        .eq('category', category)
        .order('rating', { ascending: false });

    if (error) {
        console.error('Error fetching venues by category:', error);
        return [];
    }

    return (data || []).map(transformVenue);
}

export async function getVenuesByDistrict(district: string) {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
        .from('venues')
        .select('*')
        .eq('district', district)
        .order('rating', { ascending: false });

    if (error) {
        console.error('Error fetching venues by district:', error);
        return [];
    }

    return (data || []).map(transformVenue);
}

export async function getVenuesByCity(city: string) {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
        .from('venues')
        .select('*')
        .eq('city', city)
        .order('rating', { ascending: false });

    if (error) {
        console.error('Error fetching venues by city:', error);
        return [];
    }

    return (data || []).map(transformVenue);
}

export async function searchVenues(query: string) {
    const supabase = createServerSupabaseClient();
    const searchTerm = `%${query}%`;

    const { data, error } = await supabase
        .from('venues')
        .select('*')
        .or(`name.ilike.${searchTerm},location.ilike.${searchTerm},description.ilike.${searchTerm}`)
        .order('rating', { ascending: false })
        .limit(20);

    if (error) {
        console.error('Error searching venues:', error);
        return [];
    }

    return (data || []).map(transformVenue);
}

export async function getFeaturedVenues() {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
        .from('venues')
        .select('*')
        .eq('is_featured', true)
        .order('rating', { ascending: false })
        .limit(6);

    if (error) {
        console.error('Error fetching featured venues:', error);
        return [];
    }

    return (data || []).map(transformVenue);
}

export async function filterVenues({
    citySlug,
    districtSlug,
    categorySlug,
}: {
    citySlug?: string;
    districtSlug?: string;
    categorySlug?: string;
}) {
    const supabase = createServerSupabaseClient();
    let query = supabase.from('venues').select('*');

    if (citySlug) {
        const cityName = citySlug === 'istanbul' ? 'İstanbul' : citySlug;
        query = query.eq('city', cityName);
    }

    if (districtSlug) {
        query = query.ilike('district', `%${districtSlug.replace(/-/g, ' ')}%`);
    }

    if (categorySlug) {
        // Map slug to category name
        const categoryMap: Record<string, string> = {
            'kahvalti': 'Kahvaltı',
            'kahve': 'Kahve',
            'aksam-yemegi': 'Akşam Yemeği',
            'gece-hayati': 'Gece Hayatı',
            'calisma': 'Çalışma',
            'manzara': 'Manzara',
        };
        const categoryName = categoryMap[categorySlug];
        if (categoryName) {
            if (categoryName === 'Manzara') {
                query = query.contains('amenities', ['Boğaz Manzarası']);
            } else {
                query = query.eq('category', categoryName);
            }
        }
    }

    const { data, error } = await query.order('rating', { ascending: false });

    if (error) {
        console.error('Error filtering venues:', error);
        return [];
    }

    return (data || []).map(transformVenue);
}

// ============ LIST OPERATIONS ============

export async function getAllLists() {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
        .from('curated_lists')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching lists:', error);
        return [];
    }

    return (data || []).map(transformList);
}

export async function getListBySlug(slug: string) {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
        .from('curated_lists')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !data) {
        return null;
    }

    return transformList(data);
}

export async function getFeaturedLists() {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
        .from('curated_lists')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(3);

    if (error) {
        console.error('Error fetching featured lists:', error);
        return [];
    }

    return (data || []).map(transformList);
}

// ============ REVIEW OPERATIONS ============

export async function getReviewsByVenue(venueId: string) {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('venue_id', venueId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }

    return data || [];
}

// ============ STATIC PATH HELPERS ============

export async function getAllVenueSlugs() {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
        .from('venues')
        .select('slug');

    if (error) {
        console.error('Error fetching venue slugs:', error);
        return [];
    }

    return (data || []).map((v) => v.slug);
}

export async function getAllListSlugs() {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
        .from('curated_lists')
        .select('slug');

    if (error) {
        console.error('Error fetching list slugs:', error);
        return [];
    }

    return (data || []).map((l) => l.slug);
}

export async function getUniqueCategories() {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
        .from('venues')
        .select('category');

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }

    const categories = [...new Set((data || []).map((v) => v.category))];
    return categories.map((cat) => ({
        name: cat,
        slug: slugify(cat),
    }));
}

export async function getUniqueCities() {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
        .from('venues')
        .select('city');

    if (error) {
        console.error('Error fetching cities:', error);
        return [];
    }

    const cities = [...new Set((data || []).map((v) => v.city))];
    return cities.map((city) => ({
        name: city,
        slug: slugify(city),
    }));
}

export async function getUniqueDistricts() {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
        .from('venues')
        .select('city, district');

    if (error) {
        console.error('Error fetching districts:', error);
        return [];
    }

    const districtMap = new Map<string, { city: string; district: string }>();
    (data || []).forEach((v) => {
        const key = `${v.city}-${v.district}`;
        if (!districtMap.has(key)) {
            districtMap.set(key, { city: v.city, district: v.district });
        }
    });

    return Array.from(districtMap.values()).map((d) => ({
        citySlug: slugify(d.city),
        districtSlug: slugify(d.district),
        districtName: d.district,
    }));
}
