# hangimekan.co

İstanbul'un en iyi mekanlarını keşfetmek için premium mekan rehberi platformu.

## Teknoloji Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: TailwindCSS 3.4
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Hosting**: Vercel Edge Network
- **SEO**: ISR, JSON-LD Schema, Sitemap

## Özellikler

- 🏠 Mekan keşfi ve filtreleme
- ⭐ Kullanıcı yorumları ve puanlama
- ❤️ Favori mekanlar
- 📅 Rezervasyon sistemi
- 🔐 E-posta/şifre authentication
- 📱 Responsive tasarım
- 🚀 SSG/ISR ile yüksek performans

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Environment variables (.env.local)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=https://hangimekan.co

# Development server
npm run dev

# Production build
npm run build
```

## Supabase Kurulumu

1. Supabase Dashboard → SQL Editor
2. `supabase-schema.sql` dosyasını çalıştırın

## Deployment

Vercel'e deploy etmek için:
1. GitHub'a push edin
2. Vercel'de import edin
3. Environment variables ekleyin

## Lisans

MIT
