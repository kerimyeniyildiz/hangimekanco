import React from 'react';
import { Home, List, User, PlusCircle } from 'lucide-react';
import Link from './AppLink';
import { useRouter } from 'next/router';

const MobileNav: React.FC = () => {
  const router = useRouter();
  const path = router.pathname;

  const isActive = (route: string) => path === route;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
      <div className="flex justify-around items-center h-16">
        <Link 
          href="/" 
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/') ? 'text-primary' : 'text-gray-500'}`}
        >
          <Home size={24} strokeWidth={isActive('/') ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Keşfet</span>
        </Link>
        
        <Link 
          href="/lists" 
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/lists') ? 'text-primary' : 'text-gray-500'}`}
        >
          <List size={24} strokeWidth={isActive('/lists') ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Listeler</span>
        </Link>

        <Link 
          href="/add-venue" 
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/add-venue') ? 'text-primary' : 'text-gray-500'}`}
        >
          <PlusCircle size={24} strokeWidth={isActive('/add-venue') ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Mekan Ekle</span>
        </Link>

        <Link 
          href="/profile" 
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/profile') ? 'text-primary' : 'text-gray-500'}`}
        >
          <User size={24} strokeWidth={isActive('/profile') ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Profil</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileNav;
