import React, { useState, useEffect } from 'react';
import { Shield, Check, Star, Edit2, MapPin, Calendar, Heart, X, Save, Clock, LogIn, Loader2 } from 'lucide-react';
import VenueCard from '../components/VenueCard';
import { useAuth } from '../context/AuthContext';
import Link from '../components/AppLink';
import { supabase } from '../lib/supabase';

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

const Profile: React.FC = () => {
   const { user, isAuthenticated, isLoading: authLoading, updateProfile, reservations, savedVenueIds, userReviews, logout } = useAuth();

   const [activeTab, setActiveTab] = useState<'favorites' | 'reviews' | 'reservations'>('favorites');
   const [isEditOpen, setIsEditOpen] = useState(false);
   const [editForm, setEditForm] = useState({ name: '', location: '', bio: '' });
   const [favoriteVenues, setFavoriteVenues] = useState<VenueType[]>([]);
   const [loadingFavorites, setLoadingFavorites] = useState(false);

   // Load favorite venues from Supabase
   useEffect(() => {
      const loadFavorites = async () => {
         if (savedVenueIds.length === 0) {
            setFavoriteVenues([]);
            return;
         }

         setLoadingFavorites(true);
         const { data, error } = await supabase
            .from('venues')
            .select('*')
            .in('id', savedVenueIds);

         if (!error && data) {
            const transformed = data.map((v) => ({
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
            setFavoriteVenues(transformed);
         }
         setLoadingFavorites(false);
      };

      loadFavorites();
   }, [savedVenueIds]);

   useEffect(() => {
      if (user) {
         setEditForm({
            name: user.name,
            location: user.location || "İstanbul",
            bio: user.bio || "Merhaba!"
         });
      }
   }, [user]);

   const handleSaveProfile = async (e: React.FormEvent) => {
      e.preventDefault();
      await updateProfile(editForm);
      setIsEditOpen(false);
   };

   const handleLogout = async () => {
      await logout();
   };

   if (authLoading) {
      return (
         <div className="pt-32 pb-12 flex items-center justify-center min-h-[60vh]">
            <Loader2 className="animate-spin text-primary" size={40} />
         </div>
      );
   }

   if (!isAuthenticated || !user) {
      return (
         <div className="pt-32 pb-12 flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="bg-gray-100 p-6 rounded-full mb-6">
               <LogIn size={48} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Profilinizi görmek için giriş yapın</h2>
            <p className="text-gray-600 mb-8 max-w-md">
               Favori mekanlarınızı, rezervasyonlarınızı ve değerlendirmelerinizi görmek için oturum açın.
            </p>
            <Link to="/login" className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 transition">
               Oturum Aç
            </Link>
         </div>
      );
   }

   return (
      <div className="pt-28 pb-24 md:pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

         {/* Edit Profile Modal */}
         {isEditOpen && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
               <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                     <h3 className="text-xl font-bold">Profili Düzenle</h3>
                     <button onClick={() => setIsEditOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-4">
                     <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Ad Soyad</label>
                        <input
                           type="text"
                           value={editForm.name}
                           onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                           className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Konum</label>
                        <input
                           type="text"
                           value={editForm.location}
                           onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                           className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Hakkımda</label>
                        <textarea
                           value={editForm.bio}
                           onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                           className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:border-transparent outline-none h-32 resize-none"
                        />
                     </div>

                     <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={() => setIsEditOpen(false)} className="px-5 py-2.5 font-semibold text-gray-700 hover:bg-gray-100 rounded-lg">İptal</button>
                        <button type="submit" className="px-5 py-2.5 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 flex items-center gap-2">
                           <Save size={18} /> Kaydet
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}

         <div className="grid grid-cols-1 md:grid-cols-[1fr_2.5fr] gap-12">

            {/* Left Column: Profile Card */}
            <div className="md:sticky md:top-28 h-fit">
               <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 text-center relative overflow-hidden">
                  <div className="relative inline-block mb-6">
                     <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-white shadow-md"
                     />
                     {user.isVerified && (
                        <div className="absolute bottom-1 right-1 bg-primary text-white p-1.5 rounded-full shadow-sm">
                           <Shield size={16} fill="currentColor" />
                        </div>
                     )}
                  </div>

                  <h1 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h1>
                  <p className="text-sm text-gray-500 mb-6">Üye olma tarihi: {user.joinDate || 'Ocak 2024'}</p>

                  <div className="border-t border-gray-100 pt-6 text-left space-y-4">
                     <h3 className="font-semibold text-lg">Onaylanmış Bilgiler</h3>
                     <div className="flex items-center gap-3 text-gray-700">
                        <Check size={20} className="text-green-600" />
                        <span>E-posta adresi</span>
                     </div>
                  </div>

                  <button
                     onClick={handleLogout}
                     className="mt-6 w-full border border-gray-300 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition"
                  >
                     Çıkış Yap
                  </button>
               </div>
            </div>

            {/* Right Column: Content */}
            <div>
               {/* Bio Section */}
               <div className="mb-10">
                  <div className="flex justify-between items-start mb-4">
                     <h2 className="text-3xl font-bold text-gray-900">Merhaba, ben {user.name.split(' ')[0]}</h2>
                     <button
                        onClick={() => { setIsEditOpen(true); }}
                        className="text-sm font-medium underline flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition"
                     >
                        <Edit2 size={16} /> Profili Düzenle
                     </button>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-lg max-w-2xl">{user.bio || "Henüz biyografi eklenmemiş."}</p>

                  <div className="flex items-center gap-6 mt-6 text-gray-500">
                     <div className="flex items-center gap-2">
                        <MapPin size={18} />
                        <span>{user.location || "Konum belirtilmemiş"}</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <Star size={18} className="fill-black text-black" />
                        <span>{userReviews.length} Değerlendirme</span>
                     </div>
                  </div>
               </div>

               <hr className="border-gray-200 mb-10" />

               {/* Tabs */}
               <div className="flex gap-8 border-b border-gray-200 mb-8 overflow-x-auto">
                  <button
                     onClick={() => setActiveTab('favorites')}
                     className={`pb-3 text-sm font-semibold border-b-2 transition whitespace-nowrap ${activeTab === 'favorites' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                  >
                     Favori Mekanlar ({favoriteVenues.length})
                  </button>
                  <button
                     onClick={() => setActiveTab('reservations')}
                     className={`pb-3 text-sm font-semibold border-b-2 transition whitespace-nowrap ${activeTab === 'reservations' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                  >
                     Rezervasyonlarım ({reservations.length})
                  </button>
                  <button
                     onClick={() => setActiveTab('reviews')}
                     className={`pb-3 text-sm font-semibold border-b-2 transition whitespace-nowrap ${activeTab === 'reviews' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                  >
                     Geçmiş Yorumlar ({userReviews.length})
                  </button>
               </div>

               {/* Favorites Tab */}
               {activeTab === 'favorites' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in slide-in-from-bottom-2 duration-300">
                     {loadingFavorites ? (
                        <div className="col-span-full flex justify-center py-12">
                           <Loader2 className="animate-spin text-primary" size={32} />
                        </div>
                     ) : (
                        <>
                           {favoriteVenues.map(venue => (
                              <VenueCard key={venue.id} venue={venue} />
                           ))}
                           {favoriteVenues.length === 0 && (
                              <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                 <Heart className="mx-auto mb-3 opacity-20" size={48} />
                                 <p>Henüz favori mekanınız yok. Mekanları incelerken kalp ikonuna basarak ekleyebilirsiniz.</p>
                                 <Link to="/" className="text-primary underline mt-2 block">Mekanları Keşfet</Link>
                              </div>
                           )}
                        </>
                     )}
                  </div>
               )}

               {/* Reservations Tab */}
               {activeTab === 'reservations' && (
                  <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                     {reservations.length === 0 && (
                        <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                           <Calendar className="mx-auto mb-3 opacity-20" size={48} />
                           <p>Aktif rezervasyonunuz bulunmuyor.</p>
                        </div>
                     )}
                     {reservations.map(res => (
                        <div key={res.id} className="border border-gray-200 rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row gap-6 hover:shadow-md transition bg-white relative overflow-hidden">
                           {res.status === 'Beklemede' && <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400"></div>}
                           {res.status === 'Onaylandı' && <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>}

                           <div className="w-full sm:w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                              {res.venueImage && (
                                 <img src={res.venueImage} alt={res.venueName} className="w-full h-full object-cover" />
                              )}
                           </div>
                           <div className="flex-grow flex flex-col justify-center">
                              <div className="flex justify-between items-start">
                                 <div>
                                    <h3 className="font-bold text-lg mb-1">{res.venueName}</h3>
                                 </div>
                                 <span className={`px-3 py-1 rounded-full text-xs font-bold ${res.status === 'Onaylandı' ? 'bg-green-100 text-green-800' :
                                       res.status === 'Beklemede' ? 'bg-yellow-100 text-yellow-800' :
                                          'bg-gray-100 text-gray-800'
                                    }`}>
                                    {res.status}
                                 </span>
                              </div>
                              <div className="flex items-center gap-6 text-sm text-gray-700 mt-3">
                                 <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    <span>{res.date}</span>
                                 </div>
                                 <div className="flex items-center gap-2">
                                    <Clock size={16} />
                                    <span>{res.time}</span>
                                 </div>
                                 <div className="flex items-center gap-2">
                                    <span className="font-semibold">{res.guests} Kişi</span>
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))}
                     {reservations.length > 0 && (
                        <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600 mt-4 border border-gray-100">
                           <p>Rezervasyon değişikliği veya iptali için lütfen doğrudan mekan ile iletişime geçin veya Yardım Merkezimizi ziyaret edin.</p>
                        </div>
                     )}
                  </div>
               )}

               {/* Reviews Tab */}
               {activeTab === 'reviews' && (
                  <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                     {userReviews.length === 0 && (
                        <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                           <Star className="mx-auto mb-3 opacity-20" size={48} />
                           <p>Henüz bir değerlendirme yapmadınız.</p>
                        </div>
                     )}
                     {userReviews.map(review => (
                        <div key={review.id} className="border border-gray-200 p-6 rounded-xl hover:shadow-md transition bg-white">
                           <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">Siz</h4>
                              <span className="text-gray-400 text-sm">•</span>
                              <span className="text-gray-500 text-sm">{review.date}</span>
                           </div>
                           <div className="flex gap-1 mb-3">
                              {[...Array(5)].map((_, i) => (
                                 <Star key={i} size={14} className={i < review.rating ? "fill-primary text-primary" : "text-gray-300"} />
                              ))}
                           </div>
                           <p className="text-gray-700">{review.text}</p>
                        </div>
                     ))}
                  </div>
               )}

            </div>
         </div>
      </div>
   );
};

export default Profile;
