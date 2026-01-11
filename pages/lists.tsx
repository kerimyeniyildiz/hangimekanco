import Seo from '../components/Seo';
import CuratedLists from '../screens/CuratedLists';

const ListsPage = () => {
    return (
        <>
            <Seo
                title="Editör Seçkileri | hangimekan.co"
                description="İstanbul'un en iyi mekanlarını keşfedin. Editörlerimiz tarafından hazırlanan özel listeler ve rehberler."
                path="/lists"
            />
            <CuratedLists />
        </>
    );
};

export default ListsPage;
