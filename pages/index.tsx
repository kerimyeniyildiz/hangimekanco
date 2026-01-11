import Home from '../screens/Home';
import Seo from '../components/Seo';

const HomePage = () => {
  return (
    <>
      <Seo
        title="hangimekan.co | En iyi mekanları keşfet"
        description="Şehrin en iyi kahvaltı, kahve ve gece hayatı mekanlarını keşfet. Küratör listeleri ve detaylı mekan sayfaları."
        path="/"
      />
      <Home />
    </>
  );
};

export default HomePage;
