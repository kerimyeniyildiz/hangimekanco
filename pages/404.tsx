import Link from '../components/AppLink';
import { Home, Search, ArrowLeft } from 'lucide-react';
import Seo from '../components/Seo';

const NotFoundPage = () => {
  return (
    <>
      <Seo
        title="Sayfa Bulunamadı | hangimekan.co"
        description="Aradığınız sayfa bulunamadı."
        noIndex={true}
      />
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          {/* Illustration */}
          <div className="relative mb-8">
            <div className="text-[150px] font-black text-gray-100 leading-none select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-primary/10 p-6 rounded-full">
                <Search className="w-16 h-16 text-primary" />
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Sayfa Bulunamadı
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
            Endişelenmeyin, İstanbul'un en iyi mekanlarını keşfetmeye devam edebilirsiniz!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:opacity-90 transition shadow-lg shadow-primary/20"
            >
              <Home size={20} />
              Ana Sayfaya Dön
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
            >
              <ArrowLeft size={20} />
              Geri Git
            </button>
          </div>

          {/* Popular Links */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-4">Belki bunlar ilginizi çekebilir:</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/kahvalti" className="text-sm text-gray-600 hover:text-primary transition px-3 py-1.5 bg-gray-100 rounded-full">
                Kahvaltı
              </Link>
              <Link to="/kahve" className="text-sm text-gray-600 hover:text-primary transition px-3 py-1.5 bg-gray-100 rounded-full">
                Kahve
              </Link>
              <Link to="/aksam-yemegi" className="text-sm text-gray-600 hover:text-primary transition px-3 py-1.5 bg-gray-100 rounded-full">
                Akşam Yemeği
              </Link>
              <Link to="/lists" className="text-sm text-gray-600 hover:text-primary transition px-3 py-1.5 bg-gray-100 rounded-full">
                Editör Seçkileri
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
