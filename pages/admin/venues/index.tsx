import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, MapPin, Star } from 'lucide-react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { supabase } from '../../../lib/supabase';
import type { Venue } from '../../../lib/database.types';

const VenuesPage = () => {
    const [venues, setVenues] = useState<Venue[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchVenues = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('venues')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setVenues(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchVenues();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Bu mekanı silmek istediğinize emin misiniz?')) return;

        const { error } = await supabase
            .from('venues')
            .delete()
            .eq('id', id);

        if (!error) {
            setVenues(venues.filter(v => v.id !== id));
        } else {
            alert('Silme işlemi başarısız oldu.');
        }
    };

    const filteredVenues = venues.filter(venue =>
        venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.district.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout title="Mekan Yönetimi">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Mekan ara..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Link
                    href="/admin/venues/new"
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition"
                >
                    <Plus size={20} />
                    Yeni Mekan Ekle
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Mekan
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Kategori
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Konum
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Puan
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    İşlemler
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        Yükleniyor...
                                    </td>
                                </tr>
                            ) : filteredVenues.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        Mekan bulunamadı.
                                    </td>
                                </tr>
                            ) : (
                                filteredVenues.map((venue) => (
                                    <tr key={venue.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    <img
                                                        className="h-10 w-10 rounded-lg object-cover"
                                                        src={venue.images?.[0] || 'https://via.placeholder.com/100'}
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{venue.name}</div>
                                                    <div className="text-sm text-gray-500 truncate max-w-[200px]">{venue.description}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {venue.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <MapPin size={14} className="mr-1" />
                                                {venue.district}, {venue.city}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-900">
                                                <Star size={14} className="text-yellow-400 fill-current mr-1" />
                                                {venue.rating} <span className="text-gray-500 ml-1">({venue.review_count})</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/venues/${venue.id}`}
                                                    className="p-2 text-gray-400 hover:text-primary transition"
                                                >
                                                    <Edit size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(venue.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 transition"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default VenuesPage;
