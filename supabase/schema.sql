-- ==============================================================================
-- Fit Brilliance Ecosystem — Complete Supabase Database Schema & Storage Setup
-- ==============================================================================
-- Run this entire script in Supabase SQL Editor (Dashboard -> SQL Editor -> New Query -> Run)
-- ==============================================================================

-- 1. Customers Table (جدول العملاء وأصحاب المشاريع)
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Memberships Table (جدول العضويات المعتمدة والبروموكود)
CREATE TABLE IF NOT EXISTS public.memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_email TEXT REFERENCES public.customers(email) ON DELETE CASCADE,
  member_code TEXT UNIQUE NOT NULL,
  promo_code TEXT UNIQUE NOT NULL DEFAULT 'FOUNDER15',
  discount_percent INT DEFAULT 15,
  is_founding_member BOOLEAN DEFAULT true,
  monthly_consultations INT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Consultations Table (جدول طلبات الاستشارات وخطط الـ 90 يوم وتصوير الإيفنتات والدراسات العليا)
CREATE TABLE IF NOT EXISTS public.consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  business_name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  location TEXT,
  website_or_social TEXT,
  rating INT DEFAULT 5,
  dissatisfaction TEXT NOT NULL,
  improvement_goal TEXT NOT NULL,
  image_url TEXT,
  requested_option TEXT NOT NULL, -- 'improvement_plan' | 'event_filming' | 'academic_research' | 'activity_analysis'
  status TEXT DEFAULT 'new',
  response JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Team Applications Table (جدول طلبات التوظيف والانضمام لفريق العمل)
CREATE TABLE IF NOT EXISTS public.team_applications (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  work_mode TEXT NOT NULL,
  specialty TEXT NOT NULL,
  experience_years TEXT,
  portfolio_url TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Client Reviews Table (جدول تجارب وقصص نجاح الشركاء والباحثين)
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  rating INT DEFAULT 5,
  quote TEXT NOT NULL,
  is_founding_member BOOLEAN DEFAULT true,
  membership_code TEXT,
  proof_image_url TEXT,
  approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Contact Messages Table (جدول رسائل مركز التواصل المباشر)
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  business TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
-- 7. Analytics Events Table (جدول تتبع حركة الزوار والتوقف والتصفح)
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  section_id TEXT,
  depth_percent INT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 7. Row Level Security (RLS) Policies (سياسات الأمان للقراءة والكتابة)
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts from web forms
CREATE POLICY "Allow anon insert customers" ON public.customers FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow anon select customers" ON public.customers FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow anon insert memberships" ON public.memberships FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow anon select memberships" ON public.memberships FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow anon insert consultations" ON public.consultations FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow anon select consultations" ON public.consultations FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow anon insert team_applications" ON public.team_applications FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow anon select team_applications" ON public.team_applications FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow anon insert reviews" ON public.reviews FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow anon select reviews" ON public.reviews FOR SELECT TO anon, authenticated USING (approved = true);

CREATE POLICY "Allow anon insert contact_messages" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow anon select contact_messages" ON public.contact_messages FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow anon insert analytics_events" ON public.analytics_events FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow anon select analytics_events" ON public.analytics_events FOR SELECT TO anon, authenticated USING (true);

-- ==============================================================================
-- 8. Supabase Storage Bucket Setup (إنشاء مجلد الصور الخاص)
-- ==============================================================================

INSERT INTO storage.buckets (id, name, public) 
VALUES ('evaluation-images', 'evaluation-images', false) 
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Allow anon upload evaluation images"
ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'evaluation-images');

CREATE POLICY "Allow anon read evaluation images"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'evaluation-images');

-- ==============================================================================
-- 9. Security Hardening (إغلاق ثغرات الاستدعاء الخارجي للدوال الحساسة)
-- ==============================================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'rls_auto_enable') THEN
    REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM anon, public;
  END IF;
END $$;

-- ==============================================================================
-- 10. Admin Panel Dynamic Content Tables & Storage (لوحة تحكم المحتوى الديناميكي)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.admin_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  alt VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.admin_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_name VARCHAR(255),
  file_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.admin_contents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.admin_prices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price INTEGER NOT NULL,
  currency VARCHAR(10) DEFAULT 'EGP',
  features JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Admin Tables
ALTER TABLE public.admin_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_prices ENABLE ROW LEVEL SECURITY;

-- Allow public read, authenticated/anon insert/update for demo or admin
CREATE POLICY "Public read admin_images" ON public.admin_images FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin write admin_images" ON public.admin_images FOR ALL TO anon, authenticated USING (true);

CREATE POLICY "Public read admin_files" ON public.admin_files FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin write admin_files" ON public.admin_files FOR ALL TO anon, authenticated USING (true);

CREATE POLICY "Public read admin_contents" ON public.admin_contents FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin write admin_contents" ON public.admin_contents FOR ALL TO anon, authenticated USING (true);

CREATE POLICY "Public read admin_prices" ON public.admin_prices FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin write admin_prices" ON public.admin_prices FOR ALL TO anon, authenticated USING (true);

-- Admin Storage Buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('admin-images', 'admin-images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('admin-files', 'admin-files', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Allow public read admin-images" ON storage.objects FOR SELECT TO anon, authenticated WITH CHECK (bucket_id = 'admin-images');
CREATE POLICY "Allow upload admin-images" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'admin-images');
CREATE POLICY "Allow public read admin-files" ON storage.objects FOR SELECT TO anon, authenticated WITH CHECK (bucket_id = 'admin-files');
CREATE POLICY "Allow upload admin-files" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'admin-files');

