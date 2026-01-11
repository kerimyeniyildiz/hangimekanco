import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from '../components/AppLink';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

interface ListType {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  cover_image: string;
  author: string;
  date: string;
}

const CuratedLists: React.FC = () => {
  const [lists, setLists] = useState<ListType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLists = async () => {
      const { data, error } = await supabase
        .from('curated_lists')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setLists(data);
      }
      setLoading(false);
    };

    fetchLists();
  }, []);

  if (loading) {
    return (
      <div className="pt-24 pb-12 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Hangimekan Seçkileri</h1>
        <p className="text-lg text-gray-600">Şehri yerlisi gibi yaşamanız için editörlerimiz tarafından hazırlanan özel rehberler.</p>
      </div>

      {lists.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>Henüz liste eklenmemiş.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lists.map((list) => (
            <Link key={list.id} to={`/${list.slug}`} className="group flex flex-col h-full">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:shadow-md transition">
                {list.cover_image && (
                  <Image
                    src={list.cover_image}
                    alt={list.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2 py-1 rounded">Rehber</span>
                </div>
              </div>

              <div className="flex flex-col flex-grow">
                <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">{list.title}</h2>
                <p className="text-gray-600 line-clamp-2 mb-4 flex-grow">{list.subtitle}</p>

                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                    HM
                  </div>
                  <div className="text-xs text-gray-500">
                    <span className="font-semibold text-gray-900 block">{list.author}</span>
                    <span>{list.date}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CuratedLists;
