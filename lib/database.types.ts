export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            venues: {
                Row: {
                    id: string;
                    name: string;
                    slug: string;
                    location: string;
                    city: string;
                    district: string;
                    category: string;
                    rating: number;
                    review_count: number;
                    price_level: number;
                    images: string[];
                    description: string | null;
                    amenities: string[];
                    coordinates: { lat: number; lng: number } | null;
                    is_featured: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    slug: string;
                    location: string;
                    city?: string;
                    district: string;
                    category: string;
                    rating?: number;
                    review_count?: number;
                    price_level: number;
                    images?: string[];
                    description?: string | null;
                    amenities?: string[];
                    coordinates?: { lat: number; lng: number } | null;
                    is_featured?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    slug?: string;
                    location?: string;
                    city?: string;
                    district?: string;
                    category?: string;
                    rating?: number;
                    review_count?: number;
                    price_level?: number;
                    images?: string[];
                    description?: string | null;
                    amenities?: string[];
                    coordinates?: { lat: number; lng: number } | null;
                    is_featured?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            reviews: {
                Row: {
                    id: string;
                    venue_id: string;
                    user_id: string;
                    user_name: string;
                    user_avatar: string | null;
                    rating: number;
                    text: string | null;
                    date: string | null;
                    media: Json;
                    likes: number;
                    dislikes: number;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    venue_id: string;
                    user_id: string;
                    user_name: string;
                    user_avatar?: string | null;
                    rating: number;
                    text?: string | null;
                    date?: string | null;
                    media?: Json;
                    likes?: number;
                    dislikes?: number;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    venue_id?: string;
                    user_id?: string;
                    user_name?: string;
                    user_avatar?: string | null;
                    rating?: number;
                    text?: string | null;
                    date?: string | null;
                    media?: Json;
                    likes?: number;
                    dislikes?: number;
                    created_at?: string;
                };
            };
            curated_lists: {
                Row: {
                    id: string;
                    title: string;
                    slug: string;
                    subtitle: string | null;
                    cover_image: string | null;
                    author: string | null;
                    date: string | null;
                    content: string | null;
                    venue_ids: string[];
                    is_featured: boolean;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    title: string;
                    slug: string;
                    subtitle?: string | null;
                    cover_image?: string | null;
                    author?: string | null;
                    date?: string | null;
                    content?: string | null;
                    venue_ids?: string[];
                    is_featured?: boolean;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    title?: string;
                    slug?: string;
                    subtitle?: string | null;
                    cover_image?: string | null;
                    author?: string | null;
                    date?: string | null;
                    content?: string | null;
                    venue_ids?: string[];
                    is_featured?: boolean;
                    created_at?: string;
                };
            };
            user_favorites: {
                Row: {
                    id: string;
                    user_id: string;
                    venue_id: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    venue_id: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    venue_id?: string;
                    created_at?: string;
                };
            };
            reservations: {
                Row: {
                    id: string;
                    user_id: string;
                    venue_id: string;
                    date: string;
                    time: string;
                    guests: number;
                    status: 'Onaylandı' | 'Beklemede' | 'Tamamlandı' | 'İptal';
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    venue_id: string;
                    date: string;
                    time: string;
                    guests: number;
                    status?: 'Onaylandı' | 'Beklemede' | 'Tamamlandı' | 'İptal';
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    venue_id?: string;
                    date?: string;
                    time?: string;
                    guests?: number;
                    status?: 'Onaylandı' | 'Beklemede' | 'Tamamlandı' | 'İptal';
                    created_at?: string;
                };
            };
            user_profiles: {
                Row: {
                    id: string;
                    name: string | null;
                    avatar: string | null;
                    bio: string | null;
                    location: string | null;
                    is_verified: boolean;
                    created_at: string;
                };
                Insert: {
                    id: string;
                    name?: string | null;
                    avatar?: string | null;
                    bio?: string | null;
                    location?: string | null;
                    is_verified?: boolean;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string | null;
                    avatar?: string | null;
                    bio?: string | null;
                    location?: string | null;
                    is_verified?: boolean;
                    created_at?: string;
                };
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
        Enums: Record<string, never>;
    };
}

// Helper types for easier usage
export type Venue = Database['public']['Tables']['venues']['Row'];
export type VenueInsert = Database['public']['Tables']['venues']['Insert'];
export type Review = Database['public']['Tables']['reviews']['Row'];
export type ReviewInsert = Database['public']['Tables']['reviews']['Insert'];
export type CuratedList = Database['public']['Tables']['curated_lists']['Row'];
export type UserFavorite = Database['public']['Tables']['user_favorites']['Row'];
export type Reservation = Database['public']['Tables']['reservations']['Row'];
export type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
