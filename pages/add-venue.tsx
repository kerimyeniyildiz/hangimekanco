import AddVenue from '../screens/AddVenue';
import Seo from '../components/Seo';

const AddVenuePage = () => {
  return (
    <>
      <Seo
        title="Mekanını ekle | hangimekan.co"
        description="Mekanını binlerce kullanıcıya ulaştır. Ücretsiz başvur, topluluğa katıl."
        path="/add-venue"
      />
      <AddVenue />
    </>
  );
};

export default AddVenuePage;
