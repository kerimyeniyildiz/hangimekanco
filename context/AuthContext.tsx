import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  location?: string;
  joinDate?: string;
  isVerified?: boolean;
  isAdmin?: boolean;
}

interface Reservation {
  id: string;
  venueId: string;
  venueName: string;
  venueImage: string;
  date: string;
  time: string;
  guests: number;
  status: 'Onaylandı' | 'Beklemede' | 'Tamamlandı' | 'İptal';
}

interface Review {
  id: string;
  venueId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  text: string;
  date: string;
  media: { type: 'image' | 'video'; url: string }[];
  likes: number;
  dislikes: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;

  // Reservations
  reservations: Reservation[];
  addReservation: (venueId: string, venueName: string, venueImage: string, date: string, time: string, guests: number) => Promise<void>;

  // Favorites
  savedVenueIds: string[];
  toggleFavorite: (venueId: string) => Promise<void>;
  isFavorite: (venueId: string) => boolean;
  loadFavorites: () => Promise<void>;

  // Reviews
  userReviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'userId' | 'userName' | 'userAvatar' | 'likes' | 'dislikes'>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [savedVenueIds, setSavedVenueIds] = useState<string[]>([]);
  const [userReviews, setUserReviews] = useState<Review[]>([]);

  // Transform Supabase user to app user
  const transformUser = useCallback(async (supabaseUser: SupabaseUser): Promise<User> => {
    // Fetch user profile from user_profiles table
    const { data: profileData } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();

    const profile = profileData as { name?: string; avatar?: string; bio?: string; location?: string; is_verified?: boolean; is_admin?: boolean } | null;

    const userName = profile?.name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'Kullanıcı';

    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: userName,
      avatar: profile?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=FF385C&color=fff`,
      bio: profile?.bio || '',
      location: profile?.location || '',
      joinDate: new Date(supabaseUser.created_at).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }),
      isVerified: profile?.is_verified || false,
      isAdmin: profile?.is_admin || false,
    };
  }, []);

  // Load user data (favorites, reservations, reviews)
  const loadUserData = useCallback(async (userId: string) => {
    // Load favorites
    const { data: favorites } = await supabase
      .from('user_favorites')
      .select('venue_id')
      .eq('user_id', userId);

    setSavedVenueIds((favorites || []).map(f => f.venue_id));

    // Load reservations
    const { data: reservationData } = await supabase
      .from('reservations')
      .select(`
        id,
        venue_id,
        date,
        time,
        guests,
        status,
        venues (name, images)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    const transformedReservations: Reservation[] = (reservationData || []).map((r: any) => ({
      id: r.id,
      venueId: r.venue_id,
      venueName: r.venues?.name || 'Mekan',
      venueImage: r.venues?.images?.[0] || '',
      date: r.date,
      time: r.time,
      guests: r.guests,
      status: r.status,
    }));
    setReservations(transformedReservations);

    // Load user's reviews
    const { data: reviewData } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    const transformedReviews: Review[] = (reviewData || []).map((r: any) => ({
      id: r.id,
      venueId: r.venue_id,
      userId: r.user_id,
      userName: r.user_name,
      userAvatar: r.user_avatar || '',
      rating: r.rating,
      text: r.text || '',
      date: r.date || '',
      media: r.media || [],
      likes: r.likes || 0,
      dislikes: r.dislikes || 0,
    }));
    setUserReviews(transformedReviews);
  }, []);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();

        if (initialSession?.user) {
          setSession(initialSession);
          const appUser = await transformUser(initialSession.user);
          setUser(appUser);
          await loadUserData(initialSession.user.id);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (event === 'SIGNED_IN' && newSession?.user) {
        setSession(newSession);
        const appUser = await transformUser(newSession.user);
        setUser(appUser);
        await loadUserData(newSession.user.id);
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        setReservations([]);
        setSavedVenueIds([]);
        setUserReviews([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [transformUser, loadUserData]);

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          return { error: 'E-posta veya şifre hatalı.' };
        }
        return { error: error.message };
      }

      return {};
    } catch (err) {
      return { error: 'Giriş yapılırken bir hata oluştu.' };
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<{ error?: string }> => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          return { error: 'Bu e-posta adresi zaten kayıtlı.' };
        }
        return { error: error.message };
      }

      return {};
    } catch (err) {
      return { error: 'Kayıt olurken bir hata oluştu.' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;

    const { error } = await supabase
      .from('user_profiles')
      .update({
        name: data.name,
        bio: data.bio,
        location: data.location,
        avatar: data.avatar,
      })
      .eq('id', user.id);

    if (!error) {
      setUser({ ...user, ...data });
    }
  };

  const loadFavorites = async () => {
    if (!user) return;

    const { data: favorites } = await supabase
      .from('user_favorites')
      .select('venue_id')
      .eq('user_id', user.id);

    setSavedVenueIds((favorites || []).map(f => f.venue_id));
  };

  const toggleFavorite = async (venueId: string) => {
    if (!user) return;

    const isSaved = savedVenueIds.includes(venueId);

    if (isSaved) {
      // Remove from favorites
      await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('venue_id', venueId);

      setSavedVenueIds(prev => prev.filter(id => id !== venueId));
    } else {
      // Add to favorites
      await supabase
        .from('user_favorites')
        .insert({
          user_id: user.id,
          venue_id: venueId,
        });

      setSavedVenueIds(prev => [...prev, venueId]);
    }
  };

  const isFavorite = (venueId: string) => savedVenueIds.includes(venueId);

  const addReservation = async (
    venueId: string,
    venueName: string,
    venueImage: string,
    date: string,
    time: string,
    guests: number
  ) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('reservations')
      .insert({
        user_id: user.id,
        venue_id: venueId,
        date,
        time,
        guests,
        status: 'Beklemede',
      })
      .select()
      .single();

    if (!error && data) {
      const newReservation: Reservation = {
        id: data.id,
        venueId,
        venueName,
        venueImage,
        date,
        time,
        guests,
        status: 'Beklemede',
      };
      setReservations(prev => [newReservation, ...prev]);
    }
  };

  const addReview = async (review: Omit<Review, 'id' | 'userId' | 'userName' | 'userAvatar' | 'likes' | 'dislikes'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        venue_id: review.venueId,
        user_id: user.id,
        user_name: user.name,
        user_avatar: user.avatar,
        rating: review.rating,
        text: review.text,
        date: review.date,
        media: review.media,
      })
      .select()
      .single();

    if (!error && data) {
      const newReview: Review = {
        id: data.id,
        venueId: data.venue_id,
        userId: data.user_id,
        userName: data.user_name,
        userAvatar: data.user_avatar || '',
        rating: data.rating,
        text: data.text || '',
        date: data.date || '',
        media: data.media as Review['media'] || [],
        likes: 0,
        dislikes: 0,
      };
      setUserReviews(prev => [newReview, ...prev]);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      logout,
      updateProfile,
      reservations,
      addReservation,
      savedVenueIds,
      toggleFavorite,
      isFavorite,
      loadFavorites,
      userReviews,
      addReview,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
