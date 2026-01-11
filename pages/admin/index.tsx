import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';
import { Store, Users, Star, Calendar } from 'lucide-react';
import Link from 'next/link';

const StatCard = ({ title, value, icon: Icon, color, href }: any) => (
    <Link href={href} className="block group">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600 group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                </div>
            </div>
        </div>
    </Link>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        venues: 0,
        users: 0,
        reviews: 0,
        reservations: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [
                    { count: venuesCount },
                    { count: usersCount },
                    { count: reviewsCount },
                    { count: reservationsCount },
                ] = await Promise.all([
                    supabase.from('venues').select('*', { count: 'exact', head: true }),
                    supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
                    supabase.from('reviews').select('*', { count: 'exact', head: true }),
                    supabase.from('reservations').select('*', { count: 'exact', head: true }),
                ]);

                setStats({
                    venues: venuesCount || 0,
                    users: usersCount || 0,
                    reviews: reviewsCount || 0,
                    reservations: reservationsCount || 0,
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <AdminLayout title="Dashboard">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Toplam Mekan"
                    value={loading ? '-' : stats.venues}
                    icon={Store}
                    color="blue"
                    href="/admin/venues"
                />
                <StatCard
                    title="Kayıtlı Kullanıcı"
                    value={loading ? '-' : stats.users}
                    icon={Users}
                    color="green"
                    href="/admin"
                />
                <StatCard
                    title="İnceleme Sayısı"
                    value={loading ? '-' : stats.reviews}
                    icon={Star}
                    color="yellow"
                    href="/admin/reviews"
                />
                <StatCard
                    title="Rezervasyonlar"
                    value={loading ? '-' : stats.reservations}
                    icon={Calendar}
                    color="purple"
                    href="/admin/reservations"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Reviews Widget */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Son İncelemeler</h2>
                    <div className="space-y-4">
                        {/* Burada son incelemeler listelenebilir */}
                        <p className="text-gray-500 text-sm text-center py-4">Yakında eklenecek...</p>
                    </div>
                    <Link href="/admin/reviews" className="block mt-4 text-center text-sm font-medium text-primary hover:text-primary/80">
                        Tümünü Gör
                    </Link>
                </div>

                {/* Recent Venues Widget */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Son Eklenen Mekanlar</h2>
                    <div className="space-y-4">
                        <p className="text-gray-500 text-sm text-center py-4">Yakında eklenecek...</p>
                    </div>
                    <Link href="/admin/venues" className="block mt-4 text-center text-sm font-medium text-primary hover:text-primary/80">
                        Tümünü Gör
                    </Link>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
