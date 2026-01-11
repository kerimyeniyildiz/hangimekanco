-- hangimekan.co Seed Data
-- Bu dosyayı Supabase SQL Editor'da çalıştırın

-- ============ VENUES ============
INSERT INTO venues (name, slug, location, city, district, category, rating, review_count, price_level, images, description, amenities, coordinates)
VALUES 
-- Kahvaltı Mekanları
(
  'Mangerie Bebek',
  'mangerie-bebek',
  'Bebek, İstanbul',
  'İstanbul',
  'Bebek',
  'Kahvaltı',
  4.7,
  324,
  3,
  ARRAY['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'],
  'Boğaz manzaralı lüks kahvaltı deneyimi. Serpme kahvaltı ve à la carte seçenekler.',
  ARRAY['Boğaz Manzarası', 'Vale Parking', 'Teras', 'Wifi'],
  '{"lat": 41.0776, "lng": 29.0441}'
),
(
  'Van Kahvaltı Evi',
  'van-kahvalti-evi',
  'Cihangir, İstanbul',
  'İstanbul',
  'Cihangir',
  'Kahvaltı',
  4.8,
  512,
  2,
  ARRAY['https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', 'https://images.unsplash.com/photo-1482049016gy-d949d3f25f90?w=800'],
  'Otantik Van kahvaltısı. Kaymak, bal, peynir çeşitleri ve geleneksel lezzetler.',
  ARRAY['Bahçe', 'Wifi', 'Sigara Alanı'],
  '{"lat": 41.0308, "lng": 28.9850}'
),
(
  'Simit Sarayı Emaar',
  'simit-sarayi-emaar',
  'Emaar Square, İstanbul',
  'İstanbul',
  'Üsküdar',
  'Kahvaltı',
  4.2,
  187,
  1,
  ARRAY['https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800'],
  'Türk kahvaltı kültürünün modern yorumu. Simit, poğaça ve kahve çeşitleri.',
  ARRAY['AVM İçi', 'Wifi', 'Çocuk Dostu'],
  '{"lat": 41.0082, "lng": 29.0349}'
),

-- Kahve Mekanları
(
  'Petra Roasting Co.',
  'petra-roasting-co',
  'Karaköy, İstanbul',
  'İstanbul',
  'Karaköy',
  'Kahve',
  4.9,
  678,
  2,
  ARRAY['https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800', 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800'],
  '3. dalga kahve kültürünün öncülerinden. Özel kavrum kahveler ve brewing yöntemleri.',
  ARRAY['Wifi', 'Laptop Dostu', 'Teras'],
  '{"lat": 41.0215, "lng": 28.9761}'
),
(
  'Coffee Department',
  'coffee-department',
  'Nişantaşı, İstanbul',
  'İstanbul',
  'Nişantaşı',
  'Kahve',
  4.6,
  234,
  2,
  ARRAY['https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800'],
  'Specialty coffee ve brunch menüsü. Minimalist tasarım ve kaliteli kahve.',
  ARRAY['Wifi', 'Laptop Dostu', 'Brunch'],
  '{"lat": 41.0510, "lng": 28.9937}'
),
(
  'Kronotrop',
  'kronotrop',
  'Cihangir, İstanbul',
  'İstanbul',
  'Cihangir',
  'Kahve',
  4.8,
  445,
  2,
  ARRAY['https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800'],
  'İstanbul''un specialty coffee öncüsü. Kendi kavrum kahveleri ve eğitimler.',
  ARRAY['Wifi', 'Kahve Eğitimi', 'Laptop Dostu'],
  '{"lat": 41.0312, "lng": 28.9845}'
),

-- Akşam Yemeği
(
  'Nusr-Et Etiler',
  'nusr-et-etiler',
  'Etiler, İstanbul',
  'İstanbul',
  'Etiler',
  'Akşam Yemeği',
  4.5,
  892,
  4,
  ARRAY['https://images.unsplash.com/photo-1544025162-d76694265947?w=800', 'https://images.unsplash.com/photo-1558030006-450675393462?w=800'],
  'Dünyaca ünlü steakhouse. Premium et kesitleri ve showtime servis.',
  ARRAY['Vale Parking', 'Rezervasyon Zorunlu', 'VIP Salon'],
  '{"lat": 41.0823, "lng": 29.0321}'
),
(
  'Mikla',
  'mikla',
  'Beyoğlu, İstanbul',
  'İstanbul',
  'Beyoğlu',
  'Akşam Yemeği',
  4.9,
  567,
  4,
  ARRAY['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800'],
  'Anadolu mutfağının modern yorumu. Michelin yıldızlı chef Mehmet Gürs.',
  ARRAY['Boğaz Manzarası', 'Fine Dining', 'Teras', 'Vale Parking'],
  '{"lat": 41.0319, "lng": 28.9771}'
),
(
  'Sunset Grill & Bar',
  'sunset-grill-bar',
  'Ulus, İstanbul',
  'İstanbul',
  'Ulus',
  'Akşam Yemeği',
  4.7,
  423,
  4,
  ARRAY['https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800'],
  'Boğaz manzaralı fine dining. Sushi, steak ve Akdeniz mutfağı.',
  ARRAY['Boğaz Manzarası', 'Vale Parking', 'Live Müzik', 'Teras'],
  '{"lat": 41.0811, "lng": 29.0336}'
),

-- Gece Hayatı
(
  'Klein',
  'klein',
  'Harbiye, İstanbul',
  'İstanbul',
  'Harbiye',
  'Gece Hayatı',
  4.6,
  789,
  3,
  ARRAY['https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800'],
  'Underground elektronik müzik kulübü. Dünyaca ünlü DJ''ler ve özel partiler.',
  ARRAY['DJ', 'Kokteyl Bar', 'VIP Alan'],
  '{"lat": 41.0469, "lng": 28.9929}'
),
(
  'Sortie',
  'sortie',
  'Kuruçeşme, İstanbul',
  'İstanbul',
  'Kuruçeşme',
  'Gece Hayatı',
  4.4,
  654,
  4,
  ARRAY['https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800'],
  'İstanbul''un ikonik gece kulübü. Boğaz kıyısında eğlence ve gastronomi.',
  ARRAY['Boğaz Manzarası', 'Vale Parking', 'VIP Alan', 'Canlı Müzik'],
  '{"lat": 41.0661, "lng": 29.0367}'
),

-- Çalışma Mekanları
(
  'MOC Nişantaşı',
  'moc-nisantasi',
  'Nişantaşı, İstanbul',
  'İstanbul',
  'Nişantaşı',
  'Çalışma',
  4.7,
  234,
  2,
  ARRAY['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
  'Premium coworking space. Toplantı odaları, hızlı wifi ve kahve.',
  ARRAY['Wifi', 'Toplantı Odası', 'Kahve', 'Printer'],
  '{"lat": 41.0523, "lng": 28.9945}'
),
(
  'Kolektif House Levent',
  'kolektif-house-levent',
  'Levent, İstanbul',
  'İstanbul',
  'Levent',
  'Çalışma',
  4.5,
  312,
  3,
  ARRAY['https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800'],
  'Modern ofis çözümleri. Esnek çalışma alanları ve networking imkanları.',
  ARRAY['Wifi', 'Toplantı Odası', 'Etkinlik Alanı', 'Kafeterya'],
  '{"lat": 41.0823, "lng": 29.0108}'
);

-- ============ CURATED LISTS ============
INSERT INTO curated_lists (title, slug, subtitle, cover_image, author, date, content, venue_ids, is_featured)
VALUES 
(
  'İstanbul''un En İyi Kahvaltı Mekanları',
  'istanbulun-en-iyi-kahvalti-mekanlari',
  'Hafta sonu kahvaltısı için en iyi 10 mekan rehberi',
  'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800',
  'Hangimekan Editör',
  '2024-01-15',
  'İstanbul''un en lezzetli kahvaltı mekanlarını sizler için derledik. Serpme kahvaltıdan brunch''a, gelenekselden moderne her tarza uygun öneriler.',
  (SELECT ARRAY_AGG(id) FROM venues WHERE category = 'Kahvaltı'),
  true
),
(
  '3. Dalga Kahve Rehberi',
  '3-dalga-kahve-rehberi',
  'Specialty coffee severler için İstanbul''un en iyi kahvecileri',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
  'Hangimekan Editör',
  '2024-01-10',
  'V60, Chemex, Aeropress... Kahve tutkunları için İstanbul''un en kaliteli 3. dalga kahvecilerini keşfedin.',
  (SELECT ARRAY_AGG(id) FROM venues WHERE category = 'Kahve'),
  true
),
(
  'Boğaz Manzaralı Restoranlar',
  'bogaz-manzarali-restoranlar',
  'İstanbul''un en güzel manzarasına sahip restoranlar',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
  'Hangimekan Editör',
  '2024-01-05',
  'Boğaz''ın eşsiz manzarası eşliğinde unutulmaz yemek deneyimleri. Romantik akşam yemekleri için en iyi tercihler.',
  (SELECT ARRAY_AGG(id) FROM venues WHERE 'Boğaz Manzarası' = ANY(amenities)),
  true
);

-- Verify data
SELECT 'Venues:', COUNT(*) FROM venues
UNION ALL
SELECT 'Lists:', COUNT(*) FROM curated_lists;
