import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    Store,
    List,
    MessageSquare,
    Calendar,
    Settings,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import Seo from '../Seo';

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
}

const AdminLayout = ({ children, title = 'Admin Panel' }: AdminLayoutProps) => {
    const { user, loading, logout } = useAuth() as any; // Using any to bypass strict type check for now if Context isn't fully updated in IDE cache
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (!loading && (!user || !user.isAdmin)) {
            router.push('/login?redirect=/admin');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user || !user.isAdmin) {
        return null; // Will redirect in useEffect
    }

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
        { icon: Store, label: 'Mekanlar', href: '/admin/venues' },
        { icon: List, label: 'Listeler', href: '/admin/lists' },
        { icon: MessageSquare, label: 'İncelemeler', href: '/admin/reviews' },
        { icon: Calendar, label: 'Rezervasyonlar', href: '/admin/reservations' },
        // { icon: Settings, label: 'Ayarlar', href: '/admin/settings' },
    ];

    return (
        <>
            <Seo title={`${title} | hangimekan.co`} noIndex={true} />

            <div className="min-h-screen bg-gray-100 flex">
                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside className={`
          fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
                    <div className="h-full flex flex-col">
                        {/* Logo */}
                        <div className="h-16 flex items-center px-6 border-b border-gray-200">
                            <Link href="/" className="text-2xl font-black text-primary">
                                hm<span className="text-gray-900">.admin</span>
                            </Link>
                            <button
                                className="ml-auto lg:hidden text-gray-500"
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = router.pathname === item.href || router.pathname.startsWith(`${item.href}/`);

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`
                      flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors
                      ${isActive
                                                ? 'bg-primary/10 text-primary'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                    `}
                                    >
                                        <Icon size={20} />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* User Profile */}
                        <div className="p-4 border-t border-gray-200">
                            <div className="flex items-center gap-3 px-4 py-3 mb-2">
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-8 h-8 rounded-full bg-gray-200"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {user.name}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        Admin
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={logout}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            >
                                <LogOut size={20} />
                                Çıkış Yap
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    {/* Top Bar (Mobile Only) */}
                    <div className="lg:hidden h-16 bg-white border-b border-gray-200 flex items-center px-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 text-gray-500 hover:text-gray-700"
                        >
                            <Menu size={24} />
                        </button>
                        <span className="ml-4 text-lg font-semibold text-gray-900">
                            {title}
                        </span>
                    </div>

                    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                        <div className="max-w-7xl mx-auto">
                            <h1 className="text-2xl font-bold text-gray-900 mb-6 hidden lg:block">
                                {title}
                            </h1>
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
};

export default AdminLayout;
