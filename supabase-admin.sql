-- ADMİN PANELİ ALTYAPISI
-- Bu dosyayı Supabase SQL Editor'da çalıştırın

-- 1. Admin kolonu ekle
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- 2. Admin kontrol fonksiyonu
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. RLS Politikaları (Adminlere Tam Yetki)

-- VENUES
CREATE POLICY "Admins can insert venues" ON venues
FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update venues" ON venues
FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete venues" ON venues
FOR DELETE USING (is_admin());

-- CURATED_LISTS (Önce mevcut politikaları kontrol etmek gerekebilir ama yeni politikalar eklenebilir)
-- Eğer public read varsa, INSERT/UPDATE/DELETE admin only olmalı.
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'curated_lists' AND policyname = 'Admins can insert lists') THEN
        CREATE POLICY "Admins can insert lists" ON curated_lists FOR INSERT WITH CHECK (is_admin());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'curated_lists' AND policyname = 'Admins can update lists') THEN
        CREATE POLICY "Admins can update lists" ON curated_lists FOR UPDATE USING (is_admin());
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'curated_lists' AND policyname = 'Admins can delete lists') THEN
        CREATE POLICY "Admins can delete lists" ON curated_lists FOR DELETE USING (is_admin());
    END IF;
END $$;

-- REVIEWS
CREATE POLICY "Admins can delete reviews" ON reviews
FOR DELETE USING (is_admin());

-- RESERVATIONS
CREATE POLICY "Admins can view all reservations" ON reservations
FOR SELECT USING (is_admin());

CREATE POLICY "Admins can update reservations" ON reservations
FOR UPDATE USING (is_admin());

-- USER PROFILES (Admin başkalarını editleyebilir mi? Şimdilik gerek yok)

-- Kendinizi admin yapmak için:
-- UPDATE user_profiles SET is_admin = true WHERE id = 'SİZİN_USER_ID_NİZ';
