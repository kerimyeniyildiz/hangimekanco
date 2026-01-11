import HelpCenter from '../screens/HelpCenter';
import Seo from '../components/Seo';

const HelpPage = () => {
  return (
    <>
      <Seo
        title="Yardım Merkezi | hangimekan.co"
        description="Rezervasyon, ödeme ve güvenlik hakkında sıkça sorulan sorular ve destek kanalları."
        path="/help"
      />
      <HelpCenter />
    </>
  );
};

export default HelpPage;
