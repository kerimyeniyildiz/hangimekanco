import Link from '../components/AppLink';
import Seo from '../components/Seo';

const NotFoundPage = () => {
  return (
    <>
      <Seo
        title="Sayfa bulunamadı | hangimekan.co"
        description="Aradığınız sayfa bulunamadı. Ana sayfaya dönerek keşfe devam edebilirsiniz."
        path="/404"
        noIndex
      />
      <div className="pt-32 pb-12 min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Sayfa bulunamadı</h1>
        <p className="text-gray-600 mb-6">Aradığınız sayfa taşınmış veya kaldırılmış olabilir.</p>
        <Link to="/" className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition">
          Anasayfaya dön
        </Link>
      </div>
    </>
  );
};

export default NotFoundPage;
