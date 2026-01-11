import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, Image as ImageIcon, Video, X } from 'lucide-react';
import { Review, Media } from '../types';
import { useAuth } from '../context/AuthContext';

interface ReviewSectionProps {
  venueId: string;
  reviews: Review[];
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ venueId, reviews }) => {
  // Use props reviews (which are now combined in VenueDetail)
  // But maintain local state for new input
  const { addReview, user, isAuthenticated } = useAuth();
  
  const [newReviewText, setNewReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [mediaFiles, setMediaFiles] = useState<{ file: File; preview: string; type: 'image' | 'video' }[]>([]);

  // Simulate file handling without backend
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files) as File[];
      const newMedia = filesArray.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        type: file.type.startsWith('video') ? 'video' as const : 'image' as const
      }));
      setMediaFiles(prev => [...prev, ...newMedia]);
    }
  };

  const removeMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return alert("Yorum yapmak için lütfen giriş yapın.");
    if (rating === 0) return alert("Lütfen bir puan verin.");
    
    const newReview: Review = {
      id: Math.random().toString(36).substr(2, 9),
      venueId: venueId, // Fixed: Now correctly associating review with the venue
      userId: 'currentUser', // Marker for current user
      userName: user?.name || 'Misafir Kullanıcı',
      userAvatar: user?.avatar || 'https://picsum.photos/seed/guest/100/100',
      rating,
      text: newReviewText,
      date: new Date().toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }),
      media: mediaFiles.map(m => ({ type: m.type, url: m.preview })),
      likes: 0,
      dislikes: 0
    };

    addReview(newReview);
    setNewReviewText('');
    setRating(0);
    setMediaFiles([]);
  };

  return (
    <div className="py-8 border-t border-gray-200 mt-8">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <Star className="fill-primary text-primary" size={24} />
        {reviews.length > 0 ? `${(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)} · ${reviews.length} yorum` : 'Henüz yorum yok'}
      </h2>

      {/* Review Form */}
      <div className="bg-gray-50 p-6 rounded-xl mb-10 border border-gray-100">
        <h3 className="font-semibold mb-4 text-lg">Deneyimini Paylaş</h3>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                className="focus:outline-none transition-transform hover:scale-110"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  size={28}
                  className={`${
                    star <= (hoverRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none mb-4 resize-none"
            rows={4}
            placeholder={isAuthenticated ? "Mekan nasıldı? Yemekler, atmosfer ve servis hakkında neler düşünüyorsun?" : "Yorum yapmak için lütfen giriş yapın."}
            value={newReviewText}
            onChange={(e) => setNewReviewText(e.target.value)}
            disabled={!isAuthenticated}
            required
          />

          {/* Media Preview */}
          {mediaFiles.length > 0 && (
            <div className="flex gap-4 mb-4 overflow-x-auto pb-2">
              {mediaFiles.map((m, idx) => (
                <div key={idx} className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 group">
                  {m.type === 'video' ? (
                    <video src={m.preview} className="w-full h-full object-cover" />
                  ) : (
                    <img src={m.preview} alt="preview" className="w-full h-full object-cover" />
                  )}
                  <button
                    type="button"
                    onClick={() => removeMedia(idx)}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 hover:bg-black/70 transition opacity-0 group-hover:opacity-100"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="flex gap-3">
              <label className={`cursor-pointer flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm ${!isAuthenticated && 'opacity-50 cursor-not-allowed'}`}>
                <ImageIcon size={18} />
                Fotoğraf Ekle
                <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" disabled={!isAuthenticated} />
              </label>
              <label className={`cursor-pointer flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm ${!isAuthenticated && 'opacity-50 cursor-not-allowed'}`}>
                <Video size={18} />
                Video Ekle
                <input type="file" accept="video/*" multiple onChange={handleFileChange} className="hidden" disabled={!isAuthenticated} />
              </label>
            </div>
            <button
              type="submit"
              disabled={!isAuthenticated}
              className={`bg-gradient-to-r from-primary to-rose-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:shadow-lg transition transform hover:-translate-y-0.5 ${!isAuthenticated && 'opacity-50 cursor-not-allowed'}`}
            >
              Yorum Yap
            </button>
          </div>
        </form>
      </div>

      {/* Reviews List */}
      <div className="flex flex-col gap-10">
        {reviews.map((review) => (
          <div key={review.id} className="flex flex-col gap-3 border-b border-gray-100 pb-8 last:border-0 last:pb-0">
            <div className="flex items-center gap-3">
              <img src={review.userAvatar} alt={review.userName} loading="lazy" decoding="async" className="w-12 h-12 rounded-full object-cover border border-gray-100" />
              <div>
                <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                <p className="text-sm text-gray-500">{review.date}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 my-1">
               {[...Array(5)].map((_, i) => (
                 <Star key={i} size={14} className={i < review.rating ? "fill-primary text-primary" : "text-gray-300"} />
               ))}
            </div>

            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              {review.text}
            </p>

            {/* Review Media Gallery */}
            {review.media.length > 0 && (
              <div className="flex gap-2 overflow-x-auto py-2">
                {review.media.map((media, idx) => (
                   <div key={idx} className="w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 cursor-pointer">
                     {media.type === 'video' ? (
                       <video src={media.url} className="w-full h-full object-cover" controls />
                     ) : (
                       <img src={media.url} alt="Review attachment" loading="lazy" decoding="async" className="w-full h-full object-cover hover:scale-105 transition duration-300" />
                     )}
                   </div>
                ))}
              </div>
            )}

            <div className="flex gap-4 mt-2">
              <button 
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-600 transition"
              >
                <ThumbsUp size={16} />
                <span>Faydalı ({review.likes})</span>
              </button>
              <button 
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition"
              >
                <ThumbsDown size={16} />
                <span>({review.dislikes})</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;
