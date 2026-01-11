import React from 'react';
import { Globe, Twitter, Instagram, Facebook } from 'lucide-react';
import Link from './AppLink';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-12 pb-24 md:pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Destek</h4>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li><Link to="/help" className="hover:underline">Yardım Merkezi</Link></li>
              <li><a href="#" className="hover:underline">AirCover</a></li>
              <li><a href="#" className="hover:underline">Engelli bireyler için destek</a></li>
              <li><a href="#" className="hover:underline">İptal seçenekleri</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Topluluk</h4>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li><a href="#" className="hover:underline">Mekan sahipleri forumu</a></li>
              <li><a href="#" className="hover:underline">Öneriler</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Mekan Sahipliği</h4>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li><Link to="/add-venue" className="hover:underline font-semibold text-primary">Mekanınızı ekleyin</Link></li>
              <li><a href="#" className="hover:underline">Sorumlu mekan sahipliği</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Hangimekan</h4>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li><a href="#" className="hover:underline">Basın Odası</a></li>
              <li><a href="#" className="hover:underline">Yeni özellikler</a></li>
              <li><a href="#" className="hover:underline">Kariyer</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500">
            © 2024 Hangimekan.co, Inc. · Gizlilik · Şartlar · Site Haritası
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 font-semibold text-gray-900 text-sm cursor-pointer hover:underline">
               <Globe size={16} />
               Türkçe (TR)
            </div>
            <div className="flex gap-4">
               <Facebook size={18} className="cursor-pointer hover:text-primary transition" />
               <Twitter size={18} className="cursor-pointer hover:text-primary transition" />
               <Instagram size={18} className="cursor-pointer hover:text-primary transition" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
