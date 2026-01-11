import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, MessageCircle, Phone } from 'lucide-react';

const FAQS = [
  {
    question: "Rezervasyonumu nasıl iptal edebilirim?",
    answer: "Profilinize gidin, 'Rezervasyonlarım' sekmesini bulun ve iptal etmek istediğiniz rezervasyonu seçin. İptal politikasına bağlı olarak tam veya kısmi iade alabilirsiniz."
  },
  {
    question: "Mekan sahibiyle nasıl iletişime geçebilirim?",
    answer: "Bir mekanın detay sayfasında 'Soru Sor' bölümünü kullanarak veya rezervasyon yaptıktan sonra mesajlaşma paneli üzerinden mekan sahibiyle doğrudan iletişime geçebilirsiniz."
  },
  {
    question: "Ödeme yöntemleri nelerdir?",
    answer: "Kredi kartı, banka kartı ve bazı bölgelerde Apple Pay veya Google Pay ile ödeme kabul ediyoruz. Tüm ödemeler güvenli altyapımız üzerinden işlenir."
  },
  {
    question: "Hesabımı nasıl doğrulayabilirim?",
    answer: "Profil ayarlarınızdan 'Kimlik Doğrulama' bölümüne giderek kimlik fotoğrafınızı ve bir selfie yükleyerek hesabınızı onaylı hale getirebilirsiniz."
  },
  {
    question: "Bir mekanı nasıl şikayet ederim?",
    answer: "Mekan detay sayfasının alt kısmında bulunan 'Hata Bildir' veya 'Şikayet Et' butonlarını kullanarak endişelerinizi bize iletebilirsiniz."
  }
];

const HelpCenter: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="pt-24 pb-12 min-h-screen bg-white">
      {/* Hero Search */}
      <div className="bg-gray-100 py-12 px-4 mb-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Size nasıl yardımcı olabiliriz?</h1>
          <div className="relative max-w-xl mx-auto">
            <input 
              type="text" 
              placeholder="Bir konu arayın (örn. ödeme, iptal)..." 
              className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-300 shadow-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
           <div className="border border-gray-200 p-6 rounded-xl hover:shadow-lg transition cursor-pointer">
              <h3 className="font-bold text-lg mb-2">Misafirler için</h3>
              <p className="text-gray-600 text-sm">Rezervasyon yapma, ödeme ve seyahat sorunları.</p>
           </div>
           <div className="border border-gray-200 p-6 rounded-xl hover:shadow-lg transition cursor-pointer">
              <h3 className="font-bold text-lg mb-2">Mekan Sahipleri için</h3>
              <p className="text-gray-600 text-sm">İlan verme, ödemeleri alma ve misafir iletişimi.</p>
           </div>
           <div className="border border-gray-200 p-6 rounded-xl hover:shadow-lg transition cursor-pointer">
              <h3 className="font-bold text-lg mb-2">Güvenlik ve Erişim</h3>
              <p className="text-gray-600 text-sm">Hesap güvenliği, raporlama ve erişilebilirlik.</p>
           </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">Sıkça Sorulan Sorular</h2>
        <div className="space-y-4 mb-16">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="border-b border-gray-200 pb-4">
              <button 
                className="w-full flex justify-between items-center text-left py-2 hover:text-primary transition"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <span className="font-medium text-lg text-gray-800">{faq.question}</span>
                {openIndex === idx ? <ChevronUp /> : <ChevronDown />}
              </button>
              {openIndex === idx && (
                <div className="mt-2 text-gray-600 leading-relaxed animate-in slide-in-from-top-2 duration-200">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-2xl p-8 flex flex-col md:flex-row justify-between items-center gap-6">
           <div>
             <h3 className="text-xl font-bold mb-2">Hala yardıma mı ihtiyacınız var?</h3>
             <p className="text-gray-600">Destek ekibimiz 7/24 yanınızda.</p>
           </div>
           <div className="flex gap-4">
              <button className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition flex items-center gap-2">
                 <MessageCircle size={18} /> Canlı Destek
              </button>
              <button className="border border-black text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition flex items-center gap-2">
                 <Phone size={18} /> Bizi Arayın
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default HelpCenter;