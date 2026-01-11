import Profile from '../screens/Profile';
import Seo from '../components/Seo';

const ProfilePage = () => {
  return (
    <>
      <Seo
        title="Profil | hangimekan.co"
        description="Profilini yönet, favorilerini ve rezervasyonlarını görüntüle."
        path="/profile"
        noIndex
      />
      <Profile />
    </>
  );
};

export default ProfilePage;
