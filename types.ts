export interface User {
  id: string;
  name: string;
  email?: string; // Added for login context
  avatar: string;
  bio?: string;
  location?: string;
  joinDate?: string;
  isVerified?: boolean;
}

export interface Media {
  type: 'image' | 'video';
  url: string;
}

export interface Review {
  id: string;
  venueId: string; // Critical: Link review to a venue
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  text: string;
  date: string;
  media: Media[];
  likes: number;
  dislikes: number;
}

export interface Venue {
  id: string;
  name: string;
  location: string;
  category: string;
  rating: number;
  reviewCount: number;
  priceLevel: 1 | 2 | 3 | 4; // $, $$, $$$, $$$$
  images: string[];
  description: string;
  amenities: string[];
  coordinates: { lat: number; lng: number };
  reviews: Review[];
}

export interface CuratedList {
  id: string;
  title: string;
  subtitle: string;
  coverImage: string;
  author: string;
  date: string;
  content: string; // Markdown or HTML description
  venueIds: string[]; // Venues included in this list
}

export type Category = 'Tümü' | 'Kahvaltı' | 'Kahve' | 'Akşam Yemeği' | 'Gece Hayatı' | 'Manzara' | 'Çalışma';