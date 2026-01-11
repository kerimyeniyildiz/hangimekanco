import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Star, MapPin, Share, Heart, Wifi, Car, Info, CheckCircle, ChevronDown, ChevronUp, X, ChevronLeft, ChevronRight, Flag } from 'lucide-react';
import ReviewSection from '../components/ReviewSection';
import { useAuth } from '../context/AuthContext';
import Link from '../components/AppLink';


// Simple Toast Component
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'info'; onClose: () => void }) => (
  <div className={`fixed top-24 right-4 z-[60] flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl animate-in slide-in-from-right duration-300 ${type === 'success' ? 'bg-green-600 text-white' : 'bg-gray-900 text-white'}`}>
    {type === 'success' ? <CheckCircle size={20} /> : <Info size={20} />}
    <span className="font-medium text-sm">{message}</span>
    <button onClick={onClose} className="ml-2 hover:bg-white/20 rounded-full p-1"><X size={14} /></button>
  </div>
);

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
  reviews?: any[];
}

interface VenueDetailProps {
  venue: VenueType;
}

const VenueDetail: React.FC<VenueDetailProps> = ({ venue }) => {
  const { isAuthenticated, addReservation, isFavorite, toggleFavorite, userReviews } = useAuth();

  // Interactive States
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const [isReserving, setIsReserving] = useState(false);

  // Lightbox State
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Report Modal State
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Dynamic Pricing & Date States
  const [guestCount, setGuestCount] = useState(2);
  const [isGuestOpen, setIsGuestOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('19:30');

  // Computed Reviews (Static + User's global reviews for this venue)
  const venueReviews = [...userReviews.filter(r => r.venueId === venue.id), ...(venue.reviews || [])];
  const fallbackImage = 'https://picsum.photos/seed/venue-fallback/1200/900';
  const safeImages = venue.images.length > 0 ? venue.images : [fallbackImage];
  const galleryImages = [
    safeImages[0],
    safeImages[1] ?? safeImages[0],
    safeImages[2] ?? safeImages[0],
    safeImages[3] ?? safeImages[0],
    safeImages[4] ?? safeImages[0],
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [venue.id]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Handle Keyboard for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isGalleryOpen) return;
      if (e.key === 'Escape') setIsGalleryOpen(false);
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGalleryOpen, currentImageIndex]);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Bağlantı panoya kopyalandı!', 'info');
  };

  const handleSave = () => {
    toggleFavorite(venue.id);
    showToast(!isFavorite(venue.id) ? 'Favorilere eklendi!' : 'Favorilerden kaldırıldı.', 'success');
  };

  const handleReserve = () => {
    if (!isAuthenticated) {
      showToast('Rezervasyon yapmak için lütfen önce giriş yapın.', 'info');
      setTimeout(() => window.location.assign('/login'), 1500);
      return;
    }

    setIsReserving(true);

    // Simulate API call and add to context
    setTimeout(() => {
      setIsReserving(false);
      const dateObj = new Date(selectedDate);
      const formattedDate = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

      addReservation(venue.id, venue.name, venue.images[0] || '', formattedDate, selectedTime, guestCount);
      showToast('Rezervasyon talebiniz alındı! Profilim sayfasından takip edebilirsiniz.', 'success');
    }, 1500);
  };

  const openGallery = (index: number) => {
    setCurrentImageIndex(index % safeImages.length);
    setIsGalleryOpen(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % safeImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsReportOpen(false);
    showToast('Bildiriminiz için teşekkürler. İnceliyoruz.', 'info');
  };

  if (!venue) {
    return (
      <div className="pt-32 text-center">
        <h2 className="text-2xl font-bold">Mekan bulunamadı</h2>
        <Link to="/" className="text-primary hover:underline mt-4 block">Anasayfaya dön</Link>
      </div>
    );
  }

  // Price Calculations
  const basePrice = venue.priceLevel * 150;
  const serviceFee = Math.round(basePrice * guestCount * 0.1); // 10% fee
  const totalPrice = (basePrice * guestCount) + serviceFee + 50; // +50 booking fee

  const isSaved = isFavorite(venue.id);

  return (
    <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Lightbox / Gallery Overlay */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col">
          <div className="p-4 flex justify-between items-center">
            <button onClick={() => setIsGalleryOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition"><X size={24} /></button>
            <span className="font-semibold">{currentImageIndex + 1} / {safeImages.length}</span>
            <div className="w-10"></div>
          </div>
          <div className="flex-grow relative flex items-center justify-center overflow-hidden">
            <button onClick={prevImage} className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition z-10">
              <ChevronLeft size={32} />
            </button>
            <img
              src={safeImages[currentImageIndex]}
              alt={`Gallery ${currentImageIndex}`}
              className="max-h-full max-w-full object-contain animate-in fade-in zoom-in duration-300"
            />
            <button onClick={nextImage} className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition z-10">
              <ChevronRight size={32} />
            </button>
          </div>
          <div className="p-4 flex justify-center gap-2 overflow-x-auto">
            {safeImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition ${currentImageIndex === idx ? 'border-white opacity-100' : 'border-transparent opacity-50 hover:opacity-80'}`}
              >
                <img src={img} alt="thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Report Modal */}
      {isReportOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Flag size={20} className="text-red-500" /> Hata Bildir
              </h3>
              <button onClick={() => setIsReportOpen(false)} className="text-gray-400 hover:text-black"><X size={20} /></button>
            </div>
            <form onSubmit={handleReportSubmit}>
              <p className="text-gray-600 text-sm mb-4">
                Bu mekanla ilgili yanlış veya eksik bilgi mi var? Lütfen bize bildirin.
              </p>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none min-h-[100px] mb-4"
                placeholder="Örn: Konum haritada yanlış gösteriliyor..."
                required
              />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setIsReportOpen(false)} className="px-4 py-2 text-sm font-semibold hover:bg-gray-100 rounded-lg">İptal</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold bg-black text-white rounded-lg hover:bg-gray-800">Gönder</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Title Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{venue.name}</h1>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm font-medium underline">
            <div className="flex items-center gap-1">
              <Star size={16} className="fill-black" />
              <span>{venue.rating} · </span>
              <span className="text-gray-900">{venue.reviewCount} yorum</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <MapPin size={16} />
              <span>{venue.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-sm font-medium hover:bg-gray-100 px-4 py-2 rounded-lg transition"
            >
              <Share size={16} /> Paylaş
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 text-sm font-medium hover:bg-gray-100 px-4 py-2 rounded-lg transition"
            >
              <Heart size={16} className={isSaved ? 'fill-primary text-primary' : ''} />
              {isSaved ? 'Kaydedildi' : 'Kaydet'}
            </button>
          </div>
        </div>
      </div>

      {/* Image Gallery Grid (Airbnb Style) */}
      <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-2 h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-12 relative group">
        <button className="md:col-span-2 row-span-2 relative overflow-hidden" onClick={() => openGallery(0)}>
          <Image
            src={galleryImages[0]}
            alt="Main"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover hover:brightness-95 transition hover:scale-105 duration-500"
          />
        </button>
        <button className="hidden md:block overflow-hidden relative" onClick={() => openGallery(1)}>
          <Image
            src={galleryImages[1]}
            alt="Sub 1"
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover hover:brightness-95 transition hover:scale-105 duration-500"
          />
        </button>
        <button className="hidden md:block overflow-hidden relative" onClick={() => openGallery(2)}>
          <Image
            src={galleryImages[2]}
            alt="Sub 2"
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover hover:brightness-95 transition hover:scale-105 duration-500"
          />
        </button>
        <button className="hidden md:block overflow-hidden relative" onClick={() => openGallery(3)}>
          <Image
            src={galleryImages[3]}
            alt="Sub 3"
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover hover:brightness-95 transition hover:scale-105 duration-500"
          />
        </button>
        <div className="hidden md:block relative overflow-hidden">
          <button className="absolute inset-0" onClick={() => openGallery(4)} aria-label="Galeri aç">
            <Image
              src={galleryImages[4]}
              alt="Sub 4"
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover hover:brightness-95 transition hover:scale-105 duration-500"
            />
          </button>
          <button
            onClick={() => openGallery(0)}
            className="absolute bottom-4 right-4 bg-white px-3 py-1.5 rounded-lg text-sm font-semibold shadow-md border border-gray-900 hover:bg-gray-100 transition"
          >
            Tüm fotoğrafları göster
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Left Column: Details */}
        <div className="md:col-span-2">
          {/* Host/Category Info */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h2 className="text-xl font-semibold mb-1">Mekan Kategorisi: {venue.category}</h2>
            <p className="text-gray-500">Ortalama Fiyat: {venue.priceLevel === 1 ? 'Ekonomik' : venue.priceLevel === 2 ? 'Orta' : 'Yüksek'}</p>
          </div>

          {/* Description */}
          <div className="py-8 border-b border-gray-200">
            <p className="text-gray-700 leading-relaxed text-lg">{venue.description}</p>
          </div>

          {/* Amenities */}
          <div className="py-8 border-b border-gray-200">
            <h3 className="text-xl font-semibold mb-6">Bu mekan neler sunuyor?</h3>
            <div className="grid grid-cols-2 gap-4">
              {venue.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-3 text-gray-700">
                  {amenity === 'Wifi' && <Wifi size={20} />}
                  {amenity === 'Vale' && <Car size={20} />}
                  <span className="text-base">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location / Map */}
          <div className="py-8 border-b border-gray-200">
            <h3 className="text-xl font-semibold mb-6">Nerede olacaksınız?</h3>
            <div className="h-[400px] w-full bg-gray-100 rounded-xl overflow-hidden relative">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${venue.coordinates.lat},${venue.coordinates.lng}&hl=tr&z=15&output=embed`}
                className="grayscale hover:grayscale-0 transition-all duration-500"
              >
              </iframe>
              <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg shadow-lg">
                <p className="font-bold text-sm text-gray-900">{venue.location}</p>
              </div>
            </div>
          </div>

          {/* Reviews Component - Now uses updated reviews */}
          <ReviewSection venueId={venue.id} reviews={venueReviews} />
        </div>

        {/* Right Column: Sticky Reservation/Info Card */}
        <div className="relative">
          <div className="sticky top-28 bg-white border border-gray-200 rounded-xl shadow-xl p-6">
            <div className="flex justify-between items-baseline mb-6">
              <span className="text-2xl font-bold">₺{basePrice} <span className="text-base font-normal text-gray-500">kişi başı</span></span>
              <div className="flex items-center gap-1 text-sm font-medium">
                <Star size={14} className="fill-black" />
                <span>{venue.rating}</span>
              </div>
            </div>

            {/* Date/Guest Selection UI */}
            <div className="border border-gray-400 rounded-lg mb-4 overflow-hidden relative">
              <div className="flex border-b border-gray-400">
                <div className="w-1/2 p-0 border-r border-gray-400 hover:bg-gray-50 relative">
                  <label className="block text-[10px] font-extrabold uppercase tracking-wide text-gray-800 absolute top-2 left-3 z-10">TARİH</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full pt-6 pb-2 px-3 bg-transparent outline-none text-sm font-medium text-gray-600 h-full cursor-pointer appearance-none"
                  />
                </div>
                <div className="w-1/2 p-0 hover:bg-gray-50 relative">
                  <label className="block text-[10px] font-extrabold uppercase tracking-wide text-gray-800 absolute top-2 left-3 z-10">SAAT</label>
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full pt-6 pb-2 px-3 bg-transparent outline-none text-sm font-medium text-gray-600 h-full cursor-pointer appearance-none"
                  />
                </div>
              </div>

              {/* Dynamic Guest Selector */}
              <div
                className="p-3 hover:bg-gray-50 cursor-pointer relative"
                onClick={() => setIsGuestOpen(!isGuestOpen)}
              >
                <label className="block text-[10px] font-extrabold uppercase tracking-wide text-gray-800">MİSAFİR</label>
                <span className="text-sm text-gray-600 font-medium">{guestCount} Kişi</span>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {isGuestOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {/* Guest Dropdown */}
              {isGuestOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-lg z-20 p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold">Yetişkinler</span>
                    <div className="flex items-center gap-3">
                      <button
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-black disabled:opacity-30"
                        onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                        disabled={guestCount <= 1}
                      >-</button>
                      <span className="w-4 text-center">{guestCount}</span>
                      <button
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-black"
                        onClick={() => setGuestCount(guestCount + 1)}
                      >+</button>
                    </div>
                  </div>
                  <button
                    className="mt-4 w-full text-sm underline font-semibold text-right"
                    onClick={() => setIsGuestOpen(false)}
                  >
                    Kapat
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleReserve}
              disabled={isReserving}
              className="w-full bg-gradient-to-r from-primary to-rose-600 hover:scale-[1.01] text-white font-bold py-3.5 rounded-lg transition-all mb-4 shadow-md flex items-center justify-center gap-2"
            >
              {isReserving ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  İşleniyor...
                </>
              ) : 'Rezervasyon Yap'}
            </button>

            <p className="text-center text-sm text-gray-500 mb-6">Henüz ödeme alınmayacak.</p>

            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span className="underline">₺{basePrice} x {guestCount} misafir</span>
                <span>₺{basePrice * guestCount}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span className="underline">Hizmet bedeli (%10)</span>
                <span>₺{serviceFee}</span>
              </div>
              <div className="flex justify-between text-gray-600 border-b border-gray-200 pb-4">
                <span className="underline">Rezervasyon ücreti (Sabit)</span>
                <span>₺50</span>
              </div>
            </div>

            <div className="flex justify-between pt-4 font-bold text-gray-800 text-lg">
              <span>Toplam</span>
              <span>₺{totalPrice}</span>
            </div>
          </div>

          <div
            className="mt-6 border border-gray-200 rounded-xl p-4 flex items-start gap-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
            onClick={() => setIsReportOpen(true)}
          >
            <Info className="text-gray-400 flex-shrink-0" />
            <p className="text-sm text-gray-500 leading-snug">
              <strong>Hata Bildir:</strong> Bu mekanın bilgilerinde bir yanlışlık olduğunu düşünüyorsanız bize bildirin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDetail;
