import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/admin/AdminLayout';
import { supabase } from '../../../lib/supabase';
import { Save, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const VenueForm = () => {
    const router = useRouter();
    const { id } = router.query;
    const isNew = id === 'new' || !id;

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        category: '',
        city: 'İstanbul',
        district: '',
        location: '', // Human readable address
        price_level: 2,
        rating: 0,
        images: [] as string[],
        amenities: [] as string[],
        coordinates: { lat: 41.0082, lng: 28.9784 },
        is_featured: false,
    });

    useEffect(() => {
        if (!isNew && id) {
            const fetchVenue = async () => {
                const { data, error } = await supabase
                    .from('venues')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (data && !error) {
                    setFormData({
                        ...data,
                        coordinates: data.coordinates || { lat: 41.0082, lng: 28.9784 },
                        images: data.images || [],
                        amenities: data.amenities || [],
                    });
                }
            };
            fetchVenue();
        }
    }, [id, isNew]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                updated_at: new Date().toISOString(),
            };

            let error;

            if (isNew) {
                const { error: insertError } = await supabase
                    .from('venues')
                    .insert([payload]);
                error = insertError;
            } else {
                const { error: updateError } = await supabase
                    .from('venues')
                    .update(payload)
                    .eq('id', id);
                error = updateError;
            }

            if (error) throw error;

            alert('Mekan başarıyla kaydedildi!');
            router.push('/admin/venues');
        } catch (error: any) {
            console.error('Save error:', error);
            alert('Hata oluştu: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <AdminLayout title={isNew ? 'Yeni Mekan Ekle' : 'Mekan Düzenle'}>
            <div className="mb-6 flex items-center justify-between">
                <Link href="/admin/venues" className="flex items-center text-gray-500 hover:text-gray-900">
                    <ArrowLeft size={20} className="mr-2" />
                    Listeye Dön
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Mekan Adı</label>
                            <input
                                required
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                value={formData.name}
                                onChange={e => handleInputChange('name', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Slug (URL)</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50"
                                placeholder="Otomatik oluşturulur"
                                value={formData.slug}
                                onChange={e => handleInputChange('slug', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Kategori</label>
                            <select
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                value={formData.category}
                                onChange={e => handleInputChange('category', e.target.value)}
                            >
                                <option value="">Seçiniz</option>
                                <option value="Kahvaltı">Kahvaltı</option>
                                <option value="Kahve">Kahve</option>
                                <option value="Akşam Yemeği">Akşam Yemeği</option>
                                <option value="Gece Hayatı">Gece Hayatı</option>
                                <option value="Çalışma">Çalışma</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Fiyat Seviyesi (1-4)</label>
                            <select
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                value={formData.price_level}
                                onChange={e => handleInputChange('price_level', Number(e.target.value))}
                            >
                                <option value={1}>₺</option>
                                <option value={2}>₺₺</option>
                                <option value={3}>₺₺₺</option>
                                <option value={4}>₺₺₺₺</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Şehir</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                value={formData.city}
                                onChange={e => handleInputChange('city', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">İlçe</label>
                            <input
                                required
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                value={formData.district}
                                onChange={e => handleInputChange('district', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Açık Adres</label>
                        <input
                            required
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            value={formData.location}
                            onChange={e => handleInputChange('location', e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Açıklama</label>
                        <textarea
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            value={formData.description}
                            onChange={e => handleInputChange('description', e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Görsel URL'leri (Her satıra bir tane)</label>
                        <textarea
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                            value={formData.images.join('\n')}
                            onChange={e => handleInputChange('images', e.target.value.split('\n').filter(Boolean))}
                            placeholder="https://example.com/image1.jpg"
                        />
                        <p className="text-xs text-gray-500">Şimdilik sadece harici URL destekleniyor.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Öne Çıkar</label>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                checked={formData.is_featured}
                                onChange={e => handleInputChange('is_featured', e.target.checked)}
                            />
                            <span className="ml-2 text-sm text-gray-600">Bu mekanı ana sayfada öne çıkar</span>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition shadow-lg shadow-primary/20 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            {isNew ? 'Mekanı Kaydet' : 'Değişiklikleri Kaydet'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default VenueForm;
