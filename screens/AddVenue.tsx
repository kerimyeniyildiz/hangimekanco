import React, { useState } from 'react';
import { Store, ArrowRight, CheckCircle, Upload } from 'lucide-react';
import Link from '../components/AppLink';

const AddVenue: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-32 pb-12 px-4 flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center">
           <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={32} className="text-green-600" />
           </div>
           <h2 className="text-2xl font-bold mb-4">Başvurunuz Alındı!</h2>
           <p className="text-gray-600 mb-8">
             Mekanınızı inceleyip en kısa sürede sizinle iletişime geçeceğiz. Hangimekan ailesine katılmak istediğiniz için teşekkürler.
           </p>
           <Link to="/" className="block w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition">
             Anasayfaya Dön
           </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 md:pb-12 min-h-screen bg-white">
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex flex-col md:flex-row items-center gap-12">
           <div className="flex-1">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
                 Mekanınızı binlerce kişiye ulaştırın.
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Hangimekan.co ile işletmenizi büyütün, yeni müşteriler edinin ve topluluğumuzun bir parçası olun.
              </p>
              <div className="flex items-center gap-2 text-primary font-bold text-lg">
                 <Store size={24} />
                 <span>Mekan Sahibi Paneli</span>
              </div>
           </div>
           <div className="flex-1 w-full max-w-md bg-gray-50 border border-gray-200 rounded-2xl p-8 shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-4">
                 <h3 className="text-xl font-bold mb-4">Başvuru Formu</h3>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mekan Adı</label>
                    <input required type="text" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-black transition" placeholder="Örn: Viyana Kahvesi" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                    <select className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-black transition bg-white">
                        <option>Kahve</option>
                        <option>Kahvaltı</option>
                        <option>Akşam Yemeği</option>
                        <option>Gece Hayatı</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">İlçe / Semt</label>
                    <input required type="text" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-black transition" placeholder="Örn: Kadıköy" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Yetkili Telefonu</label>
                    <input required type="tel" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-black transition" placeholder="0555 123 45 67" />
                 </div>
                 
                 <button type="submit" className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2 mt-4">
                    Başvuruyu Gönder <ArrowRight size={20} />
                 </button>
              </form>
           </div>
        </div>
      </div>
      
      {/* Features */}
      <div className="bg-gray-50 py-16">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                    <Store size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2">Ücretsiz Listeleme</h3>
                <p className="text-gray-600">Mekanınızı eklemek tamamen ücretsizdir. Sadece rezervasyon başına küçük bir komisyon alınır.</p>
            </div>
             <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-4">
                    <Upload size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2">Kolay Yönetim</h3>
                <p className="text-gray-600">Menünüzü, fotoğraflarınızı ve çalışma saatlerinizi panelden kolayca güncelleyin.</p>
            </div>
             <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4">
                    <CheckCircle size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2">Doğrulanmış Yorumlar</h3>
                <p className="text-gray-600">Sadece mekanı gerçekten ziyaret eden kullanıcılar yorum yapabilir.</p>
            </div>
         </div>
      </div>

    </div>
  );
};

export default AddVenue;
