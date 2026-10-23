-- ==============================================================================
-- Fit Brilliance Operations Room & Sovereign Diagnostics Schema
-- Version: 2.0 (Coach Serag Executive Hub)
-- Target Hub: ihxljggswcmwiagbnphu.supabase.co
-- ==============================================================================
-- Run this script in your Supabase SQL Editor to enable shared operations data
-- ==============================================================================

-- 1. Operations: 99 Diagnostic Matrix Table (استبيان الـ 99 سؤالاً لتشريح المشاريع)
CREATE TABLE IF NOT EXISTS public.operations_project_diagnostics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_code TEXT UNIQUE NOT NULL,
  founder_name TEXT NOT NULL,
  contact_info TEXT NOT NULL,
  business_identity TEXT NOT NULL,
  budget_tier TEXT NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  readiness_index INT DEFAULT 85,
  feasibility_verdict TEXT,
  core_bottlenecks JSONB DEFAULT '[]'::jsonb,
  recommended_intervention TEXT,
  raw_ai_report JSONB,
  coach_notes TEXT,
  coach_decision TEXT DEFAULT 'pending' CHECK (coach_decision IN ('pending', 'approved', 'conditional', 'rejected')),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'under_review', 'action_taken', 'archived')),
  dispatched_email BOOLEAN DEFAULT false,
  device_fingerprint TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast lookup by code and creation date
CREATE INDEX IF NOT EXISTS idx_project_diag_code ON public.operations_project_diagnostics(submission_code);
CREATE INDEX IF NOT EXISTS idx_project_diag_created ON public.operations_project_diagnostics(created_at DESC);

-- 2. Operations: Squad Partner & Integrity Vetting Table (تقييم شركاء العمل والخلية الخماسية)
CREATE TABLE IF NOT EXISTS public.operations_partner_vetting (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_code TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  desired_role TEXT NOT NULL,
  years_of_exp TEXT,
  portfolio_url TEXT,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  match_score INT DEFAULT 0,
  integrity_score INT DEFAULT 0,
  red_flags JSONB DEFAULT '[]'::jsonb,
  strengths JSONB DEFAULT '[]'::jsonb,
  final_recommendation TEXT DEFAULT 'operational_member' CHECK (final_recommendation IN ('strong_partner', 'operational_member', 'unfit')),
  executive_summary_ar TEXT,
  coach_notes TEXT,
  coach_decision TEXT DEFAULT 'pending' CHECK (coach_decision IN ('pending', 'accepted_partner', 'accepted_member', 'rejected')),
  status TEXT DEFAULT 'pending_interview' CHECK (status IN ('pending_interview', 'interviewed', 'contract_drafted', 'active_partner', 'archived')),
  dispatched_email BOOLEAN DEFAULT false,
  device_fingerprint TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_partner_vet_code ON public.operations_partner_vetting(candidate_code);
CREATE INDEX IF NOT EXISTS idx_partner_vet_role ON public.operations_partner_vetting(desired_role);

-- 3. Operations: Sovereign Decisions Table (سجل القرارات السيادية لغرفة العمليات)
CREATE TABLE IF NOT EXISTS public.operations_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  gateway_source TEXT NOT NULL, -- 'governance', 'squad', 'crisis', 'contracts', 'mediation'
  description TEXT NOT NULL,
  rationale TEXT,
  decision_maker TEXT DEFAULT 'كوتش مصطفى سراج',
  priority TEXT DEFAULT 'HIGH' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  impact_score INT DEFAULT 85,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  status TEXT DEFAULT 'enforced' CHECK (status IN ('draft', 'enforced', 'superseded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Operations: SOPs Standard Operating Procedures (لوائح وإجراءات التشغيل القياسية)
CREATE TABLE IF NOT EXISTS public.operations_sops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sop_code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- 'governance', 'campaigns', 'media_production', 'crisis_management', 'partner_onboarding'
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  responsible_role TEXT NOT NULL,
  version TEXT DEFAULT '1.0',
  is_active BOOLEAN DEFAULT true,
  last_reviewed TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Operations: Official Contracts Registry (أرشيف ومصفوفة العقود المعتمدة)
CREATE TABLE IF NOT EXISTS public.operations_contracts_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_number TEXT UNIQUE NOT NULL,
  contract_type_id INT NOT NULL, -- 1 to 6
  contract_title TEXT NOT NULL,
  second_party_name TEXT NOT NULL,
  second_party_phone TEXT,
  total_value NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'EGP',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'negotiation', 'signed', 'active', 'completed', 'terminated')),
  terms JSONB DEFAULT '{}'::jsonb,
  coach_approved BOOLEAN DEFAULT false,
  signed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Operations: Financial & Stress Test Snapshots (محاكاة التدفقات النقدية والتعامل مع الأزمات)
CREATE TABLE IF NOT EXISTS public.operations_financial_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_name TEXT NOT NULL,
  monthly_burn NUMERIC NOT NULL,
  runway_months NUMERIC NOT NULL,
  worst_case_revenue NUMERIC DEFAULT 0,
  stress_test_score INT DEFAULT 70,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- ==============================================================================

ALTER TABLE public.operations_project_diagnostics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operations_partner_vetting ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operations_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operations_sops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operations_contracts_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operations_financial_snapshots ENABLE ROW LEVEL SECURITY;

-- Allow anon & authenticated inserts from web portal for diagnostics & vetting
CREATE POLICY "Allow anon insert project diagnostics" ON public.operations_project_diagnostics FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow anon select project diagnostics" ON public.operations_project_diagnostics FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow authenticated update project diagnostics" ON public.operations_project_diagnostics FOR UPDATE TO anon, authenticated USING (true);

CREATE POLICY "Allow anon insert partner vetting" ON public.operations_partner_vetting FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow anon select partner vetting" ON public.operations_partner_vetting FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow authenticated update partner vetting" ON public.operations_partner_vetting FOR UPDATE TO anon, authenticated USING (true);

-- Allow operations room read/write for decisions, SOPs, contracts, and snapshots
CREATE POLICY "Allow full access decisions" ON public.operations_decisions FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access sops" ON public.operations_sops FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access contracts" ON public.operations_contracts_registry FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access financial" ON public.operations_financial_snapshots FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
