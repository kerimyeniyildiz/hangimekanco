import React, { useEffect, useState } from 'react';
import { Search, Menu, User as UserIcon, Globe, LogOut } from 'lucide-react';
import Link from './AppLink';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!router.isReady) return;
    const queryValue = typeof router.query.q === 'string' ? router.query.q : '';
    setSearchTerm(queryValue);
  }, [router.isReady, router.query.q]);

  const handleSearch = (e?: React.FormEvent | React.KeyboardEvent) => {
    e?.preventDefault();
    if (searchTerm.trim()) {
      router.push({ pathname: '/arama', query: { q: searchTerm.trim() } });
    } else {
      router.push('/arama');
    }
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    router.push('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
              H
            </div>
            <span className="text-primary text-xl font-bold hidden md:block tracking-tighter">hangimekan.co</span>
          </Link>

          {/* Search Bar - Center */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8 items-center bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow cursor-pointer py-1.5 pl-4 pr-1.5">
            <input
              type="text"
              placeholder="Mekan veya semt ara..."
              className="flex-grow bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-500 font-medium px-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="bg-primary p-2.5 rounded-full text-white flex-shrink-0">
              <Search size={14} strokeWidth={3} />
            </button>
          </form>

          {/* Mobile Search Trigger */}
          <div className="md:hidden flex-1 mx-4">
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 border border-gray-200">
              <Search size={16} className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Keşfet..."
                className="bg-transparent border-none outline-none text-sm w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
            <Link href="/lists" className="text-sm font-medium text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-full transition">
              Mekan Listeleri
            </Link>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Globe size={18} />
            </button>

            <div
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 border border-gray-300 rounded-full p-1 pl-3 hover:shadow-md cursor-pointer transition relative"
            >
              <Menu size={18} />
              <div className="bg-gray-500 rounded-full p-1 text-white overflow-hidden w-8 h-8 flex items-center justify-center">
                {isAuthenticated && user?.avatar ? (
                  <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={18} fill="white" />
                )}
              </div>

              {isMenuOpen && (
                <div className="absolute top-12 right-0 bg-white rounded-xl shadow-xl border border-gray-100 w-60 py-2 flex flex-col z-50">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <Link href="/profile" className="px-4 py-3 hover:bg-gray-50 text-sm text-left font-medium">Profilim</Link>
                      <Link href="/profile" className="px-4 py-3 hover:bg-gray-50 text-sm text-left">Kaydedilenler</Link>
                      <Link href="/help" className="px-4 py-3 hover:bg-gray-50 text-sm text-left">Yardım</Link>
                      <div className="border-t border-gray-100 mt-1"></div>
                      <button onClick={handleLogout} className="px-4 py-3 hover:bg-gray-50 text-sm text-left text-red-600 flex items-center gap-2 w-full">
                        <LogOut size={14} /> Oturumu Kapat
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="px-4 py-3 hover:bg-gray-50 text-sm font-bold text-left">Oturum aç</Link>
                      <Link href="/signup" className="px-4 py-3 hover:bg-gray-50 text-sm text-left border-b border-gray-100">Kaydol</Link>
                      <Link href="/lists" className="px-4 py-3 hover:bg-gray-50 text-sm text-left">Listeler</Link>
                      <Link href="/help" className="px-4 py-3 hover:bg-gray-50 text-sm text-left">Yardım Merkezi</Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
